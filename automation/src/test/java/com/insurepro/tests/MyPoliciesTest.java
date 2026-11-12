
package com.insurepro.tests;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;

public class MyPoliciesTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5176";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(20)
        );

        // Open frontend first
        driver.get(baseUrl);

        // Add demo customer session
        ((JavascriptExecutor) driver).executeScript(
                "localStorage.setItem('insureproCustomer', JSON.stringify({" +
                "customerId: 7," +
                "id: 7," +
                "fullName: 'InsurePro Test User'," +
                "email: 'insureprotest20261112014952@gmail.com'," +
                "phone: '9876543210'" +
                "}));"
        );

        // Open My Policies page
        driver.get(baseUrl + "/my-policies");

        // Wait until loading finishes
        wait.until(d ->
                d.findElements(
                        By.xpath("//*[contains(text(),'Loading your policies')]")
                ).isEmpty()
        );
    }

    // Test 1: Verify My Policies page loads

    @Test
    public void verifyMyPoliciesPageLoads() {

        WebElement heading = wait.until(d ->
                d.findElement(
                        By.xpath("//h1[contains(.,'My Policies')]")
                )
        );

        Assert.assertTrue(
                heading.isDisplayed(),
                "My Policies heading should be displayed"
        );

        Assert.assertTrue(
                driver.findElement(
                        By.xpath("//h2[text()='My Insurance Policies']")
                ).isDisplayed()
        );

        System.out.println(
                "My Policies Page Test PASSED"
        );
    }

    // Test 2: Verify summary cards

    @Test
    public void verifyPolicySummaryCards() {

        List<WebElement> summaryCards = driver.findElements(
                By.cssSelector(".summary-card")
        );

        Assert.assertEquals(
                summaryCards.size(),
                3,
                "Three summary cards should be displayed"
        );

        Assert.assertTrue(
                driver.findElement(
                        By.xpath("//p[text()='Total Policies']")
                ).isDisplayed()
        );

        Assert.assertTrue(
                driver.findElement(
                        By.xpath("//p[text()='Active Policies']")
                ).isDisplayed()
        );

        Assert.assertTrue(
                driver.findElement(
                        By.xpath("//p[text()='Total Coverage']")
                ).isDisplayed()
        );

        for (WebElement card : summaryCards) {
            String value = card.findElement(By.tagName("h2")).getText();

            Assert.assertFalse(
                    value.trim().isEmpty(),
                    "Summary value should not be empty"
            );

            System.out.println("Summary value: " + value);
        }

        System.out.println(
                "Policy Summary Cards Test PASSED"
        );
    }

    // Test 3: Verify policy details are displayed

    @Test
    public void verifyPolicyDetailsDisplayed() {

        List<WebElement> policyCards = wait.until(d ->
                d.findElements(By.cssSelector(".policy-card"))
        );

        Assert.assertTrue(
                policyCards.size() > 0,
                "At least one policy should be displayed"
        );

        WebElement firstPolicy = policyCards.get(0);

        Assert.assertTrue(
                firstPolicy.findElement(
                        By.cssSelector(".policy-name h3")
                ).isDisplayed(),
                "Policy name should be displayed"
        );

        Assert.assertTrue(
                firstPolicy.findElement(
                        By.cssSelector(".active-status, .inactive-status")
                ).isDisplayed(),
                "Policy status should be displayed"
        );

        Assert.assertTrue(
                firstPolicy.getText().contains("Policy Number:"),
                "Policy number should be displayed"
        );

        Assert.assertTrue(
                firstPolicy.getText().contains("Coverage Amount"),
                "Coverage amount should be displayed"
        );

        Assert.assertTrue(
                firstPolicy.getText().contains("Annual Premium"),
                "Annual premium should be displayed"
        );

        System.out.println(
                "Policy Details Test PASSED"
        );
    }

    // Test 4: Verify View Details button

    @Test
    public void verifyViewPolicyDetailsButton() {

        WebElement firstPolicy = wait.until(d ->
                d.findElement(By.cssSelector(".policy-card"))
        );

        WebElement viewDetailsButton = firstPolicy.findElement(
                By.xpath(".//button[contains(text(),'View Details')]")
        );

        Assert.assertTrue(
                viewDetailsButton.isDisplayed(),
                "View Details button should be displayed"
        );

        viewDetailsButton.click();

        Alert alert = wait.until(d -> d.switchTo().alert());

        String alertText = alert.getText();

        Assert.assertTrue(
                alertText.contains("Policy Number:"),
                "Alert should contain policy number"
        );

        Assert.assertTrue(
                alertText.contains("Policy Name:"),
                "Alert should contain policy name"
        );

        Assert.assertTrue(
                alertText.contains("Coverage:"),
                "Alert should contain coverage"
        );

        System.out.println("Policy Details Alert:");
        System.out.println(alertText);

        alert.accept();

        System.out.println(
                "View Policy Details Test PASSED"
        );
    }

    // Test 5: Verify navigation links

    @Test
    public void verifyMyPoliciesNavigationLinks() {

        String[] links = {
                "Dashboard",
                "My Policies",
                "Health Insurance",
                "Vehicle Insurance",
                "Premium Calculator",
                "My Claims",
                "Payments",
                "My Profile"
        };

        for (String linkText : links) {

            WebElement link = driver.findElement(
                    By.xpath(
                            "//nav[contains(@class,'policies-nav')]//a[contains(normalize-space(.),'"
                                    + linkText + "')]"
                    )
            );

            Assert.assertTrue(
                    link.isDisplayed(),
                    linkText + " navigation link should be displayed"
            );

            System.out.println(
                    linkText + " navigation link verified"
            );
        }

        System.out.println(
                "My Policies Navigation Test PASSED"
        );
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
