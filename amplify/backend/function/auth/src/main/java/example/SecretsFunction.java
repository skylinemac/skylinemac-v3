package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import org.json.JSONObject;
import java.util.*;

public class SecretsFunction implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        String secretValue = getSecret();
        JSONObject jObject = new JSONObject(secretValue);
        String key1 = "HostUser";
        String key2 = "HostPass";
        JSONObject responseBody = new JSONObject();
        responseBody.put("Username", jObject.getString(key1));
        responseBody.put("Password", jObject.getString(key2));
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(200);
        response.setBody(responseBody.toString());  
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.put("Access-Control-Allow-Headers", "Content-Type");
        response.setHeaders(headers);

        return response;
    }

    public static String getSecret() {

        String secretName = "HOSTPASS";
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

