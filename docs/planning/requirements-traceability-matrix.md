# Requirements Traceability Matrix

This matrix is the source of truth for relationships between requirements and
Product Backlog Items (PBIs). Requirement definitions remain in the requirement
documents, while PBI phase assignments remain in the
[Product Backlog](product-backlog.md).

Every functional and non-functional requirement must have at least one PBI
relationship. A PBI may instead be justified by an ADR or policy when it is
governance work rather than product behavior.

## Coverage Roles

| Role      | Meaning                                               |
| --------- | ----------------------------------------------------- |
| Define    | Refine content, policy, or acceptance boundaries      |
| Implement | Build or configure the required behavior              |
| Verify    | Check that the requirement is satisfied               |
| Operate   | Maintain the requirement through release or operation |

## PH-001 Product Foundation Baseline

| Requirement ID | PBI ID    | Coverage Role |
| -------------- | --------- | ------------- |
| `FR-001`       | `PBI-004` | Define        |
| `FR-002`       | `PBI-005` | Define        |
| `NFR-003`      | `PBI-001` | Implement     |
| `NFR-003`      | `PBI-003` | Implement     |
| `NFR-003`      | `PBI-016` | Define        |
| `NFR-003`      | `PBI-019` | Verify        |
| `NFR-003`      | `PBI-034` | Implement     |
| `NFR-003`      | `PBI-035` | Verify        |
| `NFR-001`      | `PBI-036` | Implement     |
| `NFR-001`      | `PBI-036` | Verify        |
| `NFR-002`      | `PBI-036` | Implement     |
| `NFR-003`      | `PBI-036` | Implement     |
| `NFR-001`      | `PBI-037` | Verify        |
| `NFR-003`      | `PBI-037` | Verify        |
| `NFR-004`      | `PBI-004` | Verify        |
| `NFR-004`      | `PBI-005` | Verify        |
| `NFR-008`      | `PBI-018` | Implement     |
| `NFR-008`      | `PBI-020` | Verify        |
| `NFR-008`      | `PBI-034` | Implement     |
| `NFR-008`      | `PBI-038` | Verify        |
| `NFR-009`      | `PBI-002` | Define        |

## PH-002 Static Portfolio Implementation

| Requirement ID | PBI ID    | Coverage Role |
| -------------- | --------- | ------------- |
| `FR-001`       | `PBI-040` | Define        |
| `FR-001`       | `PBI-021` | Implement     |
| `FR-001`       | `PBI-043` | Implement     |
| `FR-002`       | `PBI-040` | Define        |
| `FR-002`       | `PBI-022` | Implement     |
| `FR-003`       | `PBI-040` | Define        |
| `FR-003`       | `PBI-041` | Define        |
| `FR-003`       | `PBI-006` | Implement     |
| `FR-003`       | `PBI-044` | Implement     |
| `FR-004`       | `PBI-040` | Define        |
| `FR-004`       | `PBI-007` | Implement     |
| `FR-005`       | `PBI-023` | Implement     |
| `FR-006`       | `PBI-024` | Implement     |
| `FR-007`       | `PBI-040` | Define        |
| `FR-007`       | `PBI-025` | Implement     |
| `NFR-001`      | `PBI-008` | Verify        |
| `NFR-001`      | `PBI-023` | Verify        |
| `NFR-001`      | `PBI-024` | Verify        |
| `NFR-002`      | `PBI-009` | Verify        |
| `NFR-003`      | `PBI-008` | Verify        |
| `NFR-003`      | `PBI-009` | Verify        |
| `NFR-004`      | `PBI-040` | Define        |
| `NFR-004`      | `PBI-041` | Verify        |
| `NFR-004`      | `PBI-021` | Verify        |
| `NFR-004`      | `PBI-022` | Verify        |
| `NFR-006`      | `PBI-024` | Implement     |
| `NFR-006`      | `PBI-008` | Verify        |
| `NFR-007`      | `PBI-040` | Define        |
| `NFR-007`      | `PBI-025` | Implement     |

## PH-003 Deployment And Operations Readiness

| Requirement ID | PBI ID    | Coverage Role |
| -------------- | --------- | ------------- |
| `NFR-002`      | `PBI-010` | Verify        |
| `NFR-002`      | `PBI-039` | Verify        |
| `NFR-005`      | `PBI-010` | Verify        |
| `NFR-005`      | `PBI-011` | Implement     |
| `NFR-005`      | `PBI-012` | Implement     |
| `NFR-005`      | `PBI-026` | Operate       |
| `NFR-008`      | `PBI-028` | Verify        |
| `NFR-009`      | `PBI-011` | Implement     |
| `NFR-009`      | `PBI-027` | Operate       |
| `NFR-009`      | `PBI-028` | Operate       |
| `NFR-010`      | `PBI-029` | Implement     |
| `NFR-011`      | `PBI-032` | Verify        |
| `NFR-012`      | `PBI-030` | Verify        |
| `NFR-012`      | `PBI-030` | Operate       |
| `NFR-013`      | `PBI-031` | Verify        |
| `NFR-013`      | `PBI-032` | Operate       |
| `NFR-013`      | `PBI-033` | Operate       |

## PH-004 Post-Launch Optimization

| Requirement ID | PBI ID    | Coverage Role |
| -------------- | --------- | ------------- |
| `NFR-010`      | `PBI-013` | Operate       |
| `NFR-011`      | `PBI-014` | Define        |
| `NFR-011`      | `PBI-015` | Implement     |
| `NFR-011`      | `PBI-015` | Operate       |
