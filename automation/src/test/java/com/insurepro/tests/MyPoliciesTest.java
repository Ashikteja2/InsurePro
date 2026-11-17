
package com.insurepro.tests;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class MyPoliciesTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5175";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // Open application
        driver.get(baseUrl);

        // Prepare JavaScript executor
        JavascriptExecutor js = (JavascriptExecutor) driver;

        // Add test customer
        js.executeScript(
            "localStorage.setItem('insureproCustomer', JSON.stringify({" +
            "customerId: 7," +
            "id: 7," +
            "fullName: 'Test Customer'," +
            "name: 'Test Customer'," +
            "email: 'test@example.com'," +
            "phone: '9876543210'" +
            "}));"
        );

        // Add sample insurance policy
        js.executeScript(
            "localStorage.setItem('insureproPolicies', JSON.stringify([" +
            "{" +
            "id: 101," +
            "customerId: 7," +
            "policyNumber: 'INS-TEST-101'," +
            "name: 'Test Health Policy'," +
            "type: 'Health'," +
            "status: 'Active'," +
            "coverage: 500000," +
            "premium: 15000," +
            "startDate: '2026-11-16'," +
            "expiryDate: '2027-11-16'" +
            "}" +
            "]));"
        );

        // Navigate to My Policies
        driver.get(baseUrl + "/my-policies");

        wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".policies-content")
            )
        );
    }

    // TEST 1: Verify navigation links
    @Test
    public void verifyMyPoliciesNavigationLinks() {

        String[] expectedLinks = {
            "/dashboard",
            "/my-policies",
            "/health-insurance",
            "/vehicle-insurance",
            "/premium-calculator",
            "/my-claims",
            "/payments",
            "/profile"
        };

        List<WebElement> links =
            driver.findElements(By.cssSelector(".policies-nav a"));

        for (String expectedLink : expectedLinks) {

            boolean found = links.stream().anyMatch(link ->
                link.getAttribute("href").endsWith(expectedLink)
            );

            Assert.assertTrue(
                found,
                "Navigation link not found: " + expectedLink
            );

            System.out.println(
                "Navigation link verified: " + expectedLink
            );
        }

        System.out.println("My Policies Navigation Test PASSED");
    }

    // TEST 2: Verify My Policies page loads
    @Test
    public void verifyMyPoliciesPageLoads() {

        WebElement heading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[contains(.,'My Policies')]")
            )
        );

        Assert.assertTrue(
            heading.isDisplayed(),
            "My Policies heading should be displayed"
        );

        Assert.assertTrue(
            driver.getCurrentUrl().contains("/my-policies"),
            "My Policies URL is incorrect"
        );

        System.out.println("My Policies Page Test PASSED");
    }

    // TEST 3: Verify policy summary cards
    @Test
    public void verifyPolicySummaryCards() {

        wait.until(
            ExpectedConditions.numberOfElementsToBeMoreThan(
                By.cssSelector(".summary-card"),
                2
            )
        );

        List<WebElement> cards =
            driver.findElements(By.cssSelector(".summary-card"));

        Assert.assertEquals(
            cards.size(),
            3,
            "Three summary cards should be displayed"
        );

        String totalPolicies = cards.get(0)
            .findElement(By.tagName("h2")).getText();

        String activePolicies = cards.get(1)
            .findElement(By.tagName("h2")).getText();

        String totalCoverage = cards.get(2)
            .findElement(By.tagName("h2")).getText();

        System.out.println("Total Policies: " + totalPolicies);
        System.out.println("Active Policies: " + activePolicies);
        System.out.println("Total Coverage: " + totalCoverage);

        Assert.assertEquals(totalPolicies, "1");
        Assert.assertEquals(activePolicies, "1");

        // Remove currency symbols and commas
        String cleanCoverage =
            totalCoverage.replaceAll("[^0-9]", "");

        Assert.assertEquals(
            cleanCoverage,
            "500000",
            "Total coverage should be 500000"
        );

        System.out.println("Policy Summary Cards Test PASSED");
    }

    // TEST 4: Verify policy details are displayed
    @Test
    public void verifyPolicyDetailsDisplayed() {

        wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".policy-card")
            )
        );

        List<WebElement> policies =
            driver.findElements(By.cssSelector(".policy-card"));

        Assert.assertTrue(
            policies.size() > 0,
            "At least one policy should be displayed"
        );

        WebElement policyCard = policies.get(0);

        String policyName = policyCard
            .findElement(By.cssSelector(".policy-name h3"))
            .getText();

        String policyText = policyCard.getText();

        Assert.assertTrue(
            policyName.contains("Test Health Policy"),
            "Policy name is incorrect"
        );

        Assert.assertTrue(
            policyText.contains("INS-TEST-101"),
            "Policy number is missing"
        );

        Assert.assertTrue(
            policyText.contains("Active"),
            "Policy status is missing"
        );

        // Remove currency symbols, spaces and commas
        String cleanPolicyText =
            policyText.replaceAll("[^0-9]", "");

        Assert.assertTrue(
            cleanPolicyText.contains("500000"),
            "Coverage amount is missing"
        );

        System.out.println("Policy Name: " + policyName);
        System.out.println("Policy Details Test PASSED");
    }

    // TEST 5: Verify View Details button
    @Test
    public void verifyViewPolicyDetailsButton() {

        WebElement policyCard = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".policy-card")
            )
        );

        WebElement viewDetailsButton = policyCard.findElement(
            By.xpath(".//button[contains(.,'View Details')]")
        );

        Assert.assertTrue(
            viewDetailsButton.isDisplayed(),
            "View Details button should be displayed"
        );

        viewDetailsButton.click();

        // Wait for browser alert
        Alert alert = wait.until(
            ExpectedConditions.alertIsPresent()
        );

        String alertText = alert.getText();

        System.out.println("Policy Details Alert:");
        System.out.println(alertText);

        Assert.assertTrue(
            alertText.contains("INS-TEST-101"),
            "Policy number should appear in alert"
        );

        Assert.assertTrue(
            alertText.contains("Test Health Policy"),
            "Policy name should appear in alert"
        );

        alert.accept();

        System.out.println("View Policy Details Test PASSED");
    }

    // Close browser after every test
    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
