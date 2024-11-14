package org.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.DynamodbEvent;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import javax.mail.*;
import javax.mail.internet.*;
import java.util.*;

public class DynamoDBEmailLambdaHandler implements RequestHandler<DynamodbEvent, String> {

    // Method to handle DynamoDB trigger events
    @Override
    public String handleRequest(DynamodbEvent event, Context context) {
        for (DynamodbEvent.DynamodbStreamRecord record : event.getRecords()) {
            if ("INSERT".equals(record.getEventName())) {
                String name = record.getDynamodb().getNewImage().get("name").getS();
                String email = record.getDynamodb().getNewImage().get("parentemail").getS();
                //sendEmail(name, email);
            }
        }
        return "Processed DynamoDB Event";
    }

    // Method to send email using SMTP (via Secrets Manager credentials)
    public void sendEmail(String name, String toEmail) {
        try {
            // Retrieve email credentials from AWS Secrets Manager
            String secretValue = getSecret();
            secretValue.replace("\"", "").replace("{", "").replace("}","");
            String[] secretParts = secretValue.split(",");
            String username = secretParts[0];
            String password = secretParts[1];

            // Configure properties for sending email via SMTP (Gmail)
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            // Create a mail session
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });

            // Email content
            String subject = "Welcome to SMAC!";
            String body = "Hi " + name + ",\n\n" +
                    "Welcome and thank you for joining our competition -- we are excited to have you join us!" +
                    "Information about the competition will be sent to you soon as we finalize more details, but for now, just wait tight!" +
                    "If you have any questions, feel free to reach out to us at shmathclub@gmail.com" + "\n" +
                    "\n" + "Best regards,\n " +
                    "SMAC Coordinators \n" +
                    "Sophia Wang, Zachary Yuan, and Max Guo";

            // Send email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username, "Skyline Math Club"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);
            message.setText(body);
            Transport.send(message);

            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static String getSecret() {

        String secretName = "MathClubPasskey";
        Region region = Region.of("us-west-2");

        // Create a Secrets Manager client
        SecretsManagerClient client = SecretsManagerClient.builder()
                .region(region)
                .build();

        GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
                .secretId(secretName)
                .build();

        GetSecretValueResponse getSecretValueResponse;

        try {
            getSecretValueResponse = client.getSecretValue(getSecretValueRequest);
        } catch (Exception e) {
            // For a list of exceptions thrown, see
            // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            throw e;
        }

        return getSecretValueResponse.secretString();
    }
}
