
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class DashboardTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5175";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        driver.get(baseUrl);
    }

    // Helper method: Create demo customer session

    public void loginCustomer() {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "localStorage.setItem('insureproCustomer', JSON.stringify({" +
                "customerId: 7," +
                "id: 7," +
                "fullName: 'InsurePro Test User'," +
                "email: 'insureprotest20261112014952@gmail.com'," +
                "phone: '9876543210'" +
                "}));"
        );

        driver.get(baseUrl + "/dashboard");

        wait.until(d ->
                d.findElement(By.xpath(
                        "//h2[contains(text(),'Customer Dashboard')]"
                )).isDisplayed()
        );

        wait.until(d ->
                !d.findElement(By.tagName("body"))
                        .getText()
                        .contains("Loading policies...")
        );
    }

    // TEST 1: Verify dashboard loads

    @Test
    public void verifyDashboardLoads() {

        loginCustomer();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/dashboard"),
                "Dashboard did not load"
        );

        Assert.assertTrue(
                driver.findElement(By.xpath(
                        "//h2[contains(text(),'Customer Dashboard')]"
                )).isDisplayed(),
                "Dashboard heading is missing"
        );

        System.out.println(
                "Dashboard Load Test PASSED!"
        );
    }

    // TEST 2: Verify customer details

    @Test
    public void verifyCustomerDetails() {

        loginCustomer();

        WebElement welcomeHeading = wait.until(d ->
                d.findElement(By.xpath(
                        "//h1[starts-with(normalize-space(.),'Hello,')]"
                ))
        );

        Assert.assertTrue(
                welcomeHeading.getText().contains("Hello,"),
                "Customer welcome message is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.xpath(
                        "//*[normalize-space()='InsurePro Test User']"
                )).isDisplayed(),
                "Customer name is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.xpath(
                        "//*[normalize-space()='insureprotest20261112014952@gmail.com']"
                )).isDisplayed(),
                "Customer email is missing"
        );

        System.out.println(
                "Customer Details Test PASSED!"
        );
    }

    // TEST 3: Verify dashboard summary cards

    @Test
    public void verifyDashboardSummaryCards() {

        loginCustomer();

        WebElement totalPolicies = driver.findElement(
                By.xpath(
                        "//p[text()='Total Policies']/following-sibling::h2"
                )
        );

        WebElement activePolicies = driver.findElement(
                By.xpath(
                        "//p[text()='Active Policies']/following-sibling::h2"
                )
        );

        WebElement totalPremium = driver.findElement(
                By.xpath(
                        "//p[text()='Total Premium']/following-sibling::h2"
                )
        );

        Assert.assertTrue(
                totalPolicies.isDisplayed(),
                "Total Policies card is missing"
        );

        Assert.assertTrue(
                activePolicies.isDisplayed(),
                "Active Policies card is missing"
        );

        Assert.assertTrue(
                totalPremium.isDisplayed(),
                "Total Premium card is missing"
        );

        Assert.assertFalse(
                totalPolicies.getText().equals("..."),
                "Total Policies is still loading"
        );

        System.out.println(
                "Total Policies: " + totalPolicies.getText()
        );

        System.out.println(
                "Active Policies: " + activePolicies.getText()
        );

        System.out.println(
                "Total Premium: " + totalPremium.getText()
        );

        System.out.println(
                "Dashboard Summary Cards Test PASSED!"
        );
    }

    // TEST 4: Verify navigation links

    @Test
    public void verifyDashboardNavigationLinks() {

        loginCustomer();

        String[] links = {
                "Dashboard",
                "Health Insurance",
                "Vehicle Insurance",
                "My Policies",
                "Premium Calculator",
                "My Claims",
                "Payments",
                "My Profile"
        };

        for (String link : links) {

            WebElement navigationLink = wait.until(d ->
                    d.findElement(By.xpath(
                            "//nav//a[contains(normalize-space(.),'"
                                    + link + "')]"
                    ))
            );

            Assert.assertTrue(
                    navigationLink.isDisplayed(),
                    link + " navigation link is missing"
            );

            System.out.println(
                    link + " navigation link verified"
            );
        }

        System.out.println(
                "Dashboard Navigation Test PASSED!"
        );
    }

    // TEST 5: Verify logout

    @Test
    public void verifyLogout() {

        loginCustomer();

        driver.findElement(
                By.xpath("//button[contains(text(),'Logout')]")
        ).click();

        wait.until(d ->
                d.getCurrentUrl().contains("/login")
        );

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/login"),
                "Logout did not redirect to Login page"
        );

        String savedCustomer = (String)
                ((JavascriptExecutor) driver).executeScript(
                        "return localStorage.getItem('insureproCustomer');"
                );

        Assert.assertNull(
                savedCustomer,
                "Customer session was not removed"
        );

        System.out.println(
                "Logout Test PASSED!"
        );
    }

    // Close browser after every test

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
