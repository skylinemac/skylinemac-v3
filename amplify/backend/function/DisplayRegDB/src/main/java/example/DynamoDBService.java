package example;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.regions.Region;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DynamoDBService {

    private final DynamoDbClient dynamoDbClient = DynamoDbClient.builder().region(Region.US_WEST_2).build();
    private final String tableName = "partinfo-dev";

    public List<Map<String, String>> getAllItems() {
        ScanRequest scanRequest = ScanRequest.builder().tableName(tableName).build();
        ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);
        return scanResponse.items().stream()
                .map(this::formatItem)
                .collect(Collectors.toList());
    }

    public Map<String, String> deleteItem(String parentemail) {
        DeleteItemRequest deleteRequest = DeleteItemRequest.builder()
                .tableName(tableName)
                .key(Map.of("parentemail", AttributeValue.builder().s(parentemail).build()))
                .build();

        dynamoDbClient.deleteItem(deleteRequest);
        return createSuccessResponse("Item deleted successfully.");
    }

    public Map<String, String> editItem(String parentemail, Map<String, String> attributes) {
        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        StringBuilder updateExpression = new StringBuilder("SET ");

        if (attributes.containsKey("name")) {
            updateExpression.append("name = :name, ");
            expressionAttributeValues.put(":name", AttributeValue.builder().s(attributes.get("name")).build());
        }

        if (attributes.containsKey("grade")) {
            updateExpression.append("grade = :grade, ");
            expressionAttributeValues.put(":grade", AttributeValue.builder().n(attributes.get("grade")).build());
        }

        if (attributes.containsKey("school")) {
            updateExpression.append("school = :school, ");
            expressionAttributeValues.put(":school", AttributeValue.builder().s(attributes.get("school")).build());
        }

        if (attributes.containsKey("studentemail")) {
            updateExpression.append("studentemail = :studentemail, ");
            expressionAttributeValues.put(":studentemail", AttributeValue.builder().s(attributes.get("studentemail")).build());
        }

        // Remove trailing comma and space
        if (updateExpression.length() > 4) {
            updateExpression.setLength(updateExpression.length() - 2);
        }

        UpdateItemRequest updateRequest = UpdateItemRequest.builder()
                .tableName(tableName)
                .key(Map.of("parentemail", AttributeValue.builder().s(parentemail).build()))
                .updateExpression(updateExpression.toString())
                .expressionAttributeValues(expressionAttributeValues)
                .build();

        dynamoDbClient.updateItem(updateRequest);
        return createSuccessResponse("Item updated successfully.");
    }

    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    private Map<String, String> formatItem(Map<String, AttributeValue> item) {
        Map<String, String> formattedItem = new HashMap<>();
        item.forEach((key, value) -> {
            if (value.s() != null) {
                formattedItem.put(key, value.s());
            } else if (value.n() != null) {
                formattedItem.put(key, value.n());
            } else if (value.bool() != null) {
                formattedItem.put(key, String.valueOf(value.bool()));
            } else {
                formattedItem.put(key, value.toString());
            }
        });
        return formattedItem;
    }
}
