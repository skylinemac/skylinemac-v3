package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

public class DynamoDBQuizHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final DynamoDBService dynamoDBService = new DynamoDBService();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        System.out.println("Event received: " + request);

        String action = request.getHttpMethod(); // Extract action from HTTP method
        System.out.println("Action: " + action);

        if (action == null || action.isEmpty()) {
            return ResponseUtil.createErrorResponse("Missing 'action' parameter.");
        }

        switch (action) {
            case "GET":
                return ResponseUtil.createSuccessResponse(dynamoDBService.getQuestionList());
            default:
                return ResponseUtil.createErrorResponse("Invalid action.");
        }
    }
}
