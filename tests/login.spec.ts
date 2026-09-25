import { test, expect } from '@playwright/test'
import { LoginPage } from './pageobjects/LoginPage'

test.describe('Login', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('should login with standard user', async ({ page }) => {
    await loginPage.loginWithCredentials('standard_user', 'secret_sauce')
    await loginPage.checkSuccessfulLogin()
    await expect(page).toHaveURL(/inventory/)
  })

  test('should reject locked out user', async () => {
    await loginPage.loginWithCredentials('locked_out_user', 'secret_sauce')
    await loginPage.assertErrorContains('Sorry, this user has been locked out')
  })

  test('should reject invalid credentials', async () => {
    await loginPage.loginWithCredentials('invalid_user', 'wrong_password')
    await loginPage.assertErrorContains('Username and password do not match')
  })
})
