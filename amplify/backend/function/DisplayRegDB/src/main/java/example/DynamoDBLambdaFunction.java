package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.json.JSONObject;


public class DynamoDBLambdaFunction implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final DynamoDBService dynamoDBService = new DynamoDBService();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        // Log received event
        System.out.println("Event received: " + request);

        // Extract action from query parameters
        String action = (String) request.getHttpMethod();

        // Log action
        System.out.println("Action: " + action);

        // Check if action is null or empty
        if (action == null || action.isEmpty()) {
            return ResponseUtil.createErrorResponse("Missing 'action' parameter.");
        }

        switch (action) {
            case "GET":
                return ResponseUtil.createSuccessResponse(dynamoDBService.getAllItems());
            case "DELETE":
                String userToDelete = request.getBody();
                JSONObject obj = new JSONObject(userToDelete);
                int id = obj.getInt("studentID");
                String name = obj.getString("name");
                return ResponseUtil.createSuccessResponse(dynamoDBService.deleteItem(id, name));
            case "PATCH":
                String userToDelete = request.getBody();
                JSONObject obj = new JSONObject(userToDelete);
                String name = obj.getString("name");
                String grade = obj.getString("grade");
                String school = obj.getString("school");
                String parentemail = obj.getString("parentemail");
                String studentemail = obj.getString("studentemail");
                try {
                    return ResponseUtil.createSuccessResponse(dynamoDBService.editItem(name, grade, school, parentemail, studentemail));
                } catch (Exception e) {
                    return ResponseUtil.createErrorResponse(e.getMessage());
                }
            default:
                return ResponseUtil.createErrorResponse("Invalid action.");
        }
    }
}
