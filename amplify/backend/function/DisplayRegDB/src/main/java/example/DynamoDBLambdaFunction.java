package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;


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
            /*case "DELETE":
                //String parentEmailToDelete = request.get("parentemail");
                //if (parentEmailToDelete == null) {
                    return ResponseUtil.createErrorResponse("Missing 'parentemail' parameter for DELETE action.");
                //}
                //return ResponseUtil.createSuccessResponse(dynamoDBService.deleteItem(parentEmailToDelete));
            case "EDIT":
                //String parentEmailToEdit = request.get("parentemail");
                //if (parentEmailToEdit == null) {
                  return ResponseUtil.createErrorResponse("Missing 'parentemail' parameter for EDIT action.");
                //}

                String body = request.getBody();
                if (body == null) {
                    return ResponseUtil.createErrorResponse("Missing request body for EDIT action.");
                }

                /*try {
                    Map<String, String> attributes = new ObjectMapper().readValue(body, Map.class);
                    return ResponseUtil.createSuccessResponse(dynamoDBService.editItem(parentEmailToEdit, attributes));
                } catch (JsonProcessingException e) {
                    return ResponseUtil.createErrorResponse("Failed to parse request body: " + e.getMessage());
                } catch (Exception e) {
                    return ResponseUtil.createErrorResponse("An error occurred: " + e.getMessage());
                }*/
            default:
                return ResponseUtil.createErrorResponse("Invalid action.");
        }
    }
}
