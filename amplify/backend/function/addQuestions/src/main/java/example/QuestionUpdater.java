package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.json.JSONObject;


public class QuestionUpdater implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

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
                return ResponseUtil.createSuccessResponse(dynamoDBService.getHighestID());
            case "POST":
                return ResponseUtil.createSuccessResponse(dynamoDBService.addQuestion(request.getBody()));
            default:
                return ResponseUtil.createErrorResponse("Invalid action.");
        }
    }
}
