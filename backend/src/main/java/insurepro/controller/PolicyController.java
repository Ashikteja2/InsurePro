
package insurepro.controller;

import insurepro.entity.Policy;
import insurepro.entity.Customer;
import insurepro.repository.PolicyRepository;
import insurepro.repository.CustomerRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
})
public class PolicyController {

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;

    public PolicyController(
            PolicyRepository policyRepository,
            CustomerRepository customerRepository) {

        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
    }

    // Get policies for a customer
    @GetMapping("/customer/{customerId}")
    public List<Map<String, Object>> getCustomerPolicies(
            @PathVariable Long customerId) {

        List<Policy> policies =
                policyRepository.findByCustomerId(customerId);

        return policies.stream().map(policy -> {

            Map<String, Object> response = new LinkedHashMap<>();

            response.put("id", policy.getId());
            response.put("policyNumber", policy.getPolicyNumber());
            response.put("name", policy.getName());
            response.put("type", policy.getType());
            response.put("coverage", policy.getCoverage());
            response.put("premium", policy.getPremium());
            response.put("startDate", policy.getStartDate());
            response.put("expiryDate", policy.getExpiryDate());
            response.put("status", policy.getStatus());

            return response;

        }).toList();
    }

    // Purchase a policy
    @PostMapping("/purchase")
    public ResponseEntity<?> purchasePolicy(
            @RequestBody Map<String, Object> request) {

        try {

            // Accept both frontend field names
            Object customerIdValue = request.get("customerId");

            Object nameValue = request.containsKey("planName")
                    ? request.get("planName")
                    : request.get("name");

            Object typeValue = request.get("type");
            Object coverageValue = request.get("coverage");
            Object premiumValue = request.get("premium");

            if (customerIdValue == null ||
                nameValue == null ||
                typeValue == null ||
                coverageValue == null ||
                premiumValue == null) {

                return ResponseEntity.badRequest().body(
                    Map.of("message", "Required policy details are missing")
                );
            }

            Long customerId =
                    Long.valueOf(customerIdValue.toString());

            String name = nameValue.toString();
            String type = typeValue.toString();
            String coverage = coverageValue.toString();
            String premium = premiumValue.toString();

            Customer customer = customerRepository
                    .findById(customerId)
                    .orElse(null);

            if (customer == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Customer not found"));
            }

            Policy policy = new Policy();

            policy.setCustomer(customer);

            policy.setPolicyNumber(
                    "INS-" + type.toUpperCase() + "-" +
                    UUID.randomUUID().toString()
                            .substring(0, 8).toUpperCase()
            );

            policy.setName(name);
            policy.setType(type);
            policy.setCoverage(coverage);
            policy.setPremium(premium);
            policy.setStartDate(LocalDate.now());
            policy.setExpiryDate(LocalDate.now().plusYears(1));
            policy.setStatus("Active");

            Policy savedPolicy = policyRepository.save(policy);

            Map<String, Object> response = new LinkedHashMap<>();

            response.put("message", "Policy purchased successfully");
            response.put("policyId", savedPolicy.getId());
            response.put("policyNumber", savedPolicy.getPolicyNumber());
            response.put("name", savedPolicy.getName());
            response.put("type", savedPolicy.getType());
            response.put("coverage", savedPolicy.getCoverage());
            response.put("premium", savedPolicy.getPremium());
            response.put("status", savedPolicy.getStatus());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message", "Policy purchase failed",
                            "error", String.valueOf(e.getMessage())
                    ));
        }
    }
}
