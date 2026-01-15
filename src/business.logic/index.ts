// ============================================================================
// BUSINESS LOGIC BARREL EXPORTS
// ============================================================================

// Cache management functions
export {
  get_last_content_jsx,
  save_content_jsx,
  clear_last_content_jsx,
  save_content_refresh_key,
  get_content_refresh_key
} from './cache';

// Error handling and tracking
export {
  set_error_id,
  get_error_code,
  set_date_error_code,
  set_status_error_code,
  format_json_code,
  color_json_code,
  to_jsonapi_error,
  remember_exception,
  remember_error,
  remember_jsonapi_errors,
  remember_possible_error,
  get_errors_list,
  clear_errors,
  report_missing_state,
  report_missing_dialog_key,
  report_missing_dialog_state,
  report_missing_dialog_light_state,
  report_missing_dialog_dark_state,
  log_2,
  report_missing_registry_value,
  error_id
} from './errors';

// Form validation
export { default as FormValidationPolicy } from './FormValidationPolicy';

// Indexes and data management
export type { TIndexes } from './indexes';
export {
  index_by_id,
  drop_index,
  select_by_id as select
} from './indexes';

// JSON:API related classes
export { default as JsonapiError } from './JsonapiError';
export { default as JsonapiPaginationLinks, get_jsonapi_link_url } from './JsonapiPaginationLinks';
export { default as JsonapiRequest } from './JsonapiRequest';

// Logging utilities
export {
  msg,
  pre,
  log,
  ler,
  lwa as lwr,
  err
} from './logging';

// Parsing and data manipulation
export {
  get_state_form_name,
  get_parsed_content,
  parse_cookies,
  get_cookie,
  set_url_query_val,
  set_val,
  get_head_meta_content,
  get_base_route,
  get_origin_ending_fixed,
  clean_endpoint_ending,
  get_query_starting_fixed
} from './parsing';

// Error reporting chain
export type { IAs, IReportChain } from './ReportError';
export { default as ReportError } from './ReportError';

// Utility functions
export {
  is_object,
  is_record,
  is_struct,
  non_empty_string,
  is_number,
  get_val,
  safely_get_as,
  get_global_var,
  mongo_object_id,
  http_get,
  get_themed_state,
  resolve_unexpected_nesting,
  get_viewport_size,
  stretch_to_bottom
} from './utility';
