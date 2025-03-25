package example;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static APIGatewayProxyResponseEvent createSuccessResponse(Object body) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(200);
        
        try {
            // Convert body to JSON string
            String jsonBody = objectMapper.writeValueAsString(body);
            response.setBody(jsonBody);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setBody("{\"error\":\"Failed to serialize response\"}");
        }
        
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        headers.put("Access-Control-Allow-Headers", "Content-Type");
        response.setHeaders(headers);
        
        return response;
    }

    public static APIGatewayProxyResponseEvent createErrorResponse(String message) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(400);
        response.setBody("{\"error\":\"" + message + "\"}");
        response.setHeaders(Map.of("Content-Type", "application/json"));
        return response;
    }
}
