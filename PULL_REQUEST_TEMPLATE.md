<comment on what this PR does>

closes #<issue number>

---

## Code Review Checklist

### Implementation

- [ ] Does this code change accomplish what it is supposed to do?
- [ ] Can this solution be simplified without unreasonable effort
- [ ] Is the code modular enough?
- [ ] Does similar functionality already exist in the codebase? If yes, why isn’t it reused?
- [ ] Single Responsibility Principle: Does any class serve only one purpose? If not, it should probably split up in multiple classes.
- [ ] Interface Segregation: If interface implemented, is it fully implemented?
- [ ] Dependency Injection: Are central object instantiation processes managed by a single context?
- [ ] If any functionality is missing, is it marked with a comment that starts with TODO:?
- [ ] Do you see any potential to improve the performance of the code significantly? 

### Logic Errors and Bugs

- [ ] Can you think of any use case in which the code does not behave as intended?
- [ ] Can you think of any inputs or external events that could break the code?
- [ ] Are edge cases covered by tests?

### Error Handling and Logging

- [ ] Is error handling done the correct way?
- [ ] Should any logging or debugging information be added or removed?
- [ ] Are error messages user-friendly?

### Dependencies (internal and external)

- [ ] Were updates to documentation, configuration, or readme files made as required by this change?
- [ ] Is the API.md up-to-date?
- [ ] Are the enumerations between frontend and backend synchronized?

### Security and Data Privacy

- [ ] Does the code introduce any security vulnerabilities?
- [ ] Is (user) input validated, sanitized, and escaped to prevent security attacks such as cross-site scripting or SQL injection?
- [ ] Is sensitive data like user data handled and stored securely?
- [ ] Is the right encryption used?
- [ ] Is data retrieved from external APIs or libraries checked for security issues?
- [ ] Were any secrets committed?

### Testing and Testability (later)

- [ ] Have automated tests been added, or have related ones been updated to cover the change?
- [ ] Do the existing tests reasonably cover the code change?
- [ ] Are there some test cases, input or edge cases that should be tested in addition?

### Usability and Accessibility

- [ ] Is the proposed solution (UI) accessible (e.g. colorblindness, ...)?
- [ ] Is the API/UI intuitive to use?
- [ ] Was the app tested on another device?

### Readability

- [ ] Is the code easy to understand?
- [ ] Which parts were confusing to you and why?
- [ ] Can the readability of the code be improved by smaller methods/different names?
- [ ] Is the code located in the right file/folder?
- [ ] Do you think certain methods should be restructured to have a more intuitive control flow?
- [ ] Are there redundant or outdated comments?
- [ ] Could some comments convey the message better?
- [ ] Could some comments be removed by making the code itself more readable?

