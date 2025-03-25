package example;

import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.regions.Region;
import java.util.HashMap;
import java.util.Map;

public class DynamoDBService {
    private final DynamoDbClient dynamoDbClient = DynamoDbClient.builder().region(Region.US_WEST_2).build();
    private static final String TABLE_NAME = "practiceProblems-dev";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> getHighestID() {
        try {
            QueryRequest queryRequest = QueryRequest.builder()
                    .tableName(TABLE_NAME)
                    .indexName("highestID")
                    .keyConditionExpression("#pk = :constantValue")
                    .expressionAttributeNames(Map.of("#pk", "constant"))
                    .expressionAttributeValues(Map.of(":constantValue", AttributeValue.builder().n("1").build()))
                    .scanIndexForward(false)
                    .limit(1)
                    .build();

            QueryResponse queryResponse = dynamoDbClient.query(queryRequest);

            if (!queryResponse.items().isEmpty()) {
                Map<String, AttributeValue> item = queryResponse.items().get(0);
                return convertDynamoDBItemToMap(item);
            } else {
                throw new Exception("No items found");
            } 
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error fetching data: " + e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> addQuestion(String jsonBody) {
        try {
            // Parse JSON input
            Map<String, Object> formData = objectMapper.readValue(jsonBody, Map.class);

            // Prepare DynamoDB item
            Map<String, AttributeValue> item = new HashMap<>();
            item.put("questionID", AttributeValue.builder().n(formData.get("questionID").toString()).build());
            item.put("question", AttributeValue.builder().s(formData.get("question").toString()).build());
            item.put("answer", AttributeValue.builder().s(formData.get("answer").toString()).build());
            item.put("difficulty", AttributeValue.builder().s(formData.get("difficulty").toString()).build());
            item.put("source", AttributeValue.builder().s(formData.get("source").toString()).build());
            item.put("constant", AttributeValue.builder().n("1").build());

            // Create PutItem request
            PutItemRequest putItemRequest = PutItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .item(item)
                    .build();

            dynamoDbClient.putItem(putItemRequest);

            // Prepare successful response
            Map<String, Object> successResponse = new HashMap<>(formData);
            successResponse.put("message", "Data inserted successfully!");
            return successResponse;

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error processing form data: " + e.getMessage());
            return errorResponse;
        }
    }

    private Map<String, Object> convertDynamoDBItemToMap(Map<String, AttributeValue> item) {
        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<String, AttributeValue> entry : item.entrySet()) {
            result.put(entry.getKey(), 
                entry.getValue().s() != null ? entry.getValue().s() :
                entry.getValue().n() != null ? entry.getValue().n() : null
            );
        }
        return result;
    }
}