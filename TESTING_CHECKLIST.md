# Testing Checklist: How to Design Meaningful Tests

## 1. Test What Matters Most
- [ ] **Critical business logic:** Focus on the core features and calculations your app depends on
- [ ] **Edge cases:** Think about unusual or extreme inputs (empty, null, very large/small, invalid)
- [ ] **Error handling:** Make sure your code responds correctly to failures (bad input, network errors, etc.)
- [ ] **Integration points:** Test how your code interacts with external systems (APIs, databases)

## 2. Write Tests from the User's Perspective
- [ ] **Black-box testing:** Don't just test internal functions—test the public API, endpoints, or UI as a user would use them
- [ ] **Acceptance criteria:** Base your tests on real requirements or user stories

## 3. Use the Arrange-Act-Assert Pattern
- [ ] **Arrange:** Set up the conditions for your test (inputs, mocks, environment)
- [ ] **Act:** Run the code you want to test
- [ ] **Assert:** Check that the result is what you expect

### Example (Jest):
```typescript
it('returns the correct weather summary', async () => {
  // Arrange
  const city = 'London';
  mockWeatherService.getWeatherByCity.mockResolvedValue({ 
    temperature: 18, 
    description: 'rainy' 
  });

  // Act
  const result = await controller.getWeatherSummary({ city });

  // Assert
  expect(result.summary).toContain('cool and rainy');
});
```

## 4. Test Both Success and Failure
- [ ] **Happy path:** The expected, normal use case
- [ ] **Sad path:** What happens when things go wrong? (invalid input, missing data, exceptions)

## 5. Keep Tests Isolated and Deterministic
- [ ] **No side effects:** Each test should be independent and not rely on or affect others
- [ ] **Mock dependencies:** Use mocks/stubs for external services so tests are fast and reliable

## 6. Name Tests Clearly
- [ ] A good test name describes what's being tested and the expected outcome
  - `should return weather data for a valid city`
  - `should throw error for missing API key`
  - `should return 404 for unknown city`

## 7. Review and Refactor Tests
- [ ] Remove redundant or trivial tests
- [ ] Update tests when requirements change
- [ ] Use code coverage as a tool to find untested important paths, not as a goal

## 8. Test Coverage Guidelines
- [ ] **Aim for 70-90% coverage** (not 100% - it's usually not worth it)
- [ ] **Focus on quality over quantity** - meaningful tests are better than many trivial ones
- [ ] **Prioritize critical paths** and business logic
- [ ] **Don't test framework code** or trivial getters/setters

## 9. Test Types to Include
- [ ] **Unit tests:** Test individual functions/methods in isolation
- [ ] **Integration tests:** Test how components work together
- [ ] **End-to-end tests:** Test complete user workflows (for critical paths)
- [ ] **Error scenario tests:** Test how your app handles failures

## 10. Test Data and Fixtures
- [ ] **Use realistic test data** that represents real-world scenarios
- [ ] **Create reusable fixtures** for common test scenarios
- [ ] **Avoid hardcoded magic numbers** - use constants or factory functions
- [ ] **Test with boundary values** (min/max values, edge cases)

## 11. Performance and Maintainability
- [ ] **Keep tests fast** - they should run quickly during development
- [ ] **Avoid flaky tests** - tests should be deterministic and reliable
- [ ] **Use descriptive error messages** in assertions
- [ ] **Group related tests** using describe blocks

## 12. Continuous Improvement
- [ ] **Review test failures** and understand why they failed
- [ ] **Refactor tests** when the code they test changes
- [ ] **Remove obsolete tests** that no longer provide value
- [ ] **Share testing best practices** with your team

---

## Quick Reference: Test Quality Questions

Before writing a test, ask yourself:
- [ ] Will this test catch a real bug?
- [ ] Does this test verify important behavior?
- [ ] Would I be confident to refactor the code after this test passes?
- [ ] Is this test easy to understand and maintain?
- [ ] Does this test reflect how the code is actually used?

---

## Remember
**Meaningful tests are those that would catch real bugs, give you confidence to refactor, and reflect how your code is actually used. Focus on value, not just numbers!**

100% coverage is not a realistic or valuable goal for most projects. Focus on testing what matters, and don't sweat the rest. 