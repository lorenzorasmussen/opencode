---
description: Complete deployment pipeline (build + test + deploy)
agent: build
---

# Build and Deploy Pipeline

Execute full CI/CD pipeline from build to production deployment.

## Pipeline Stages

1. **Code Quality**: Lint, type-check, format validation
2. **Testing**: Full test suite execution
3. **Build**: Production build generation
4. **Security**: Dependency audit and vulnerability scan
5. **Deploy**: Staged deployment with rollback capability

## Commands

!`bun run typecheck`
!`bun run lint`
!`bun run test`
!`bun run build`
!`bun run security-audit`
!`bun run deploy:staging`
!`bun run deploy:production`

## Quality Gates

- All tests pass
- No linting errors
- TypeScript compilation succeeds
- Security audit clean
- Build artifacts generated

## Deployment Strategy

- **Staging First**: Deploy to staging environment for validation
- **Automated Testing**: Run smoke tests against staging
- **Production Deploy**: Only after staging validation
- **Rollback Ready**: Maintain previous version for quick rollback

## Monitoring

- Deployment status tracking
- Performance monitoring post-deploy
- Error alerting and incident response
