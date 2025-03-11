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
    private final String tableName = "";

    public List<Map<String, String>> getAllItems() {
        ScanRequest scanRequest = ScanRequest.builder().tableName(tableName).build();
        ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);
        return scanResponse.items().stream()
                .map(this::formatItem)
                .collect(Collectors.toList());
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
