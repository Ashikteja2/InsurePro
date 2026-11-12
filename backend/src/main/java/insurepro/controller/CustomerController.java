
package insurepro.controller;

import insurepro.entity.Customer;
import insurepro.repository.CustomerRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
})
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerController(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder) {

        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new customer
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(
            @RequestBody Customer customer) {

        if (customer.getEmail() == null ||
                customer.getEmail().isBlank() ||
                customer.getPassword() == null ||
                customer.getPassword().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email and password are required")
            );
        }

        Optional<Customer> existingCustomer =
                customerRepository.findByEmail(customer.getEmail());

        if (existingCustomer.isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Email already registered"
                    ));
        }

        // Hash the password before saving
        String hashedPassword =
                passwordEncoder.encode(customer.getPassword());

        customer.setPassword(hashedPassword);

        Customer savedCustomer =
                customerRepository.save(customer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCustomer);
    }

    // Customer login
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(
            @RequestBody Customer loginRequest) {

        if (loginRequest.getEmail() == null ||
                loginRequest.getPassword() == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        Optional<Customer> customerOptional =
                customerRepository.findByEmail(
                        loginRequest.getEmail()
                );

        if (customerOptional.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        Customer customer = customerOptional.get();

        String storedPassword = customer.getPassword();
        String enteredPassword = loginRequest.getPassword();

        boolean passwordMatches = false;

        if (storedPassword != null) {

            // Check whether the stored password is BCrypt
            if (isBCryptPassword(storedPassword)) {

                passwordMatches = passwordEncoder.matches(
                        enteredPassword,
                        storedPassword
                );

            } else {

                // Temporary migration for existing plain-text accounts
                passwordMatches =
                        storedPassword.equals(enteredPassword);

                if (passwordMatches) {

                    // Upgrade old password to BCrypt
                    customer.setPassword(
                            passwordEncoder.encode(enteredPassword)
                    );

                    customerRepository.save(customer);
                }
            }
        }

        if (!passwordMatches) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        // Password is excluded from JSON using @JsonIgnore
        return ResponseEntity.ok(customer);
    }

    // Get customer details by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(
            @PathVariable Long id) {

        Optional<Customer> customerOptional =
                customerRepository.findById(id);

        if (customerOptional.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Customer not found"
                    ));
        }

        Customer customer = customerOptional.get();

        return ResponseEntity.ok(customer);
    }

    // Identify BCrypt password hashes
    private boolean isBCryptPassword(String password) {

        return password.startsWith("$2a$") ||
                password.startsWith("$2b$") ||
                password.startsWith("$2y$");
    }
}
