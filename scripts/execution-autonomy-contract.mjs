export const requiredGlobalInvariants = [
  "approved_execution_envelope",
  "current_live_state_revalidated",
  "exact_target_scope",
  "secret_safe_projection_only",
  "no_raw_provider_state_or_plan_output",
  "no_historical_workflow_redispatch",
  "no_wip_temp_access",
  "stop_on_unexpected_drift",
];

export const requiredOperationContracts = {
  provider_inventory: {
    preconditions: ["read_only_query", "protected_inputs_present_without_value_output"],
    postconditions: [
      "project_counts_types_addresses_booleans_only",
      "no_duplicate_or_ownership_conflict",
    ],
  },
  terraform_state_projection: {
    preconditions: ["read_only_query", "no_backend_workspace_or_account_change"],
    postconditions: ["project_resource_types_addresses_counts_only", "no_state_payload_output"],
  },
  terraform_import: {
    preconditions: [
      "declared_address_unbound",
      "exactly_one_remote_object_match",
      "matching_resource_type",
      "no_duplicate_or_ownership_conflict",
      "reviewed_redacting_wrapper",
    ],
    postconditions: ["post_import_sanitized_plan"],
  },
  terraform_plan: {
    preconditions: [
      "exact_workspace_commit_and_configuration",
      "protected_inputs_present_without_value_output",
    ],
    postconditions: ["sanitized_address_action_counts_only", "no_unexpected_actions"],
  },
  terraform_apply_exact_plan: {
    preconditions: [
      "same_validated_plan_artifact",
      "plan_bound_to_current_commit_configuration_and_inputs",
      "expected_address_action_allowlist_only",
      "no_replace_or_destroy",
      "no_unexpected_cost_contract_or_deployment_effect",
    ],
    postconditions: ["post_apply_no_op_plan"],
  },
  controlled_alert_verification: {
    preconditions: [
      "transient_resource_predeclared_in_envelope",
      "confirmed_same_origin_nonexistent_path",
      "owner_managed_destination_unchanged",
      "bounded_timeout_and_failure_stop",
    ],
    postconditions: [
      "expected_down_then_recovery_sequence",
      "secret_safe_event_timestamp_status_evidence",
      "transient_resource_ready_for_exact_removal",
    ],
  },
  transient_resource_removal: {
    preconditions: ["exactly_one_transient_resource_destroy", "no_steady_resource_action"],
    postconditions: ["post_removal_no_op_plan"],
  },
  topic_commit_push_and_draft_pr: {
    preconditions: [
      "focused_staged_diff_reviewed",
      "named_topic_branch",
      "required_local_checks_pass",
      "remote_head_revalidated",
      "no_force_push",
    ],
    postconditions: ["draft_pr_matches_pushed_head"],
  },
  pull_request_ready: {
    preconditions: [
      "acceptance_evidence_complete",
      "current_head_checks_terminal_success",
      "no_unresolved_review_or_required_change",
      "head_and_scope_unchanged",
    ],
    postconditions: ["pull_request_is_ready_not_merged"],
  },
  post_merge_fast_forward_sync: {
    preconditions: [
      "owner_approved_merge_completed",
      "merged_commit_or_patch_equivalence_verified",
      "clean_local_main",
      "fast_forward_only",
    ],
    postconditions: ["local_main_matches_live_main", "no_branch_cleanup"],
  },
};

export const requiredOwnerDecisionGates = [
  "provider_dependency_or_lockfile_change",
  "credential_creation_rotation_or_value_access",
  "backend_workspace_account_or_identity_change",
  "billing_plan_entitlement_or_contract_change",
  "inventory_duplicate_ownership_or_state_conflict",
  "unexpected_plan_action_or_state_reconciliation",
  "steady_resource_replace_or_destroy",
  "alert_destination_or_policy_change",
  "production_deployment_release_or_tag",
  "merge_or_auto_merge",
  "history_rewrite_force_push_or_discard",
  "destructive_cleanup_or_branch_deletion",
];

export const allowedEffects = new Set([
  "read_only",
  "terraform_state_binding",
  "provider_mutation",
  "repository_metadata",
]);
