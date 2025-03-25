package example;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.regions.Region;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DynamoDBService {

    private final DynamoDbClient dynamoDbClient = DynamoDbClient.builder().region(Region.US_WEST_2).build();
    private final String tableName = "participantinfo-dev";

    public List<Map<String, String>> getAllItems() {
        ScanRequest scanRequest = ScanRequest.builder().tableName(tableName).build();
        ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);
        return scanResponse.items().stream()
                .map(this::formatItem)
                .collect(Collectors.toList());
    }

    public Map<String, String> deleteItem(String studentID, String name) {
        Map<String, AttributeValue> keyList = new HashMap<>();
        keyList.put("studentID", AttributeValue.builder().n(studentID).build());
        keyList.put("name", AttributeValue.builder().s(name).build());
        DeleteItemRequest deleteRequest = DeleteItemRequest.builder()
                .tableName(tableName)
                .key(keyList)
                .build();

        dynamoDbClient.deleteItem(deleteRequest);
        return createSuccessResponse("Item deleted successfully.");
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
