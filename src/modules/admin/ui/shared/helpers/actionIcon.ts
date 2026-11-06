import type { AdminAction } from 'modules/admin/domain';

const actionIcons: Record<string, string> = {
  delete_selected: 'mdi:delete-outline',
  disable_action: 'mdi:account-off-outline',
  enable: 'mdi:account-check-outline',
  update_user_ratings: 'mdi:chart-line',
  update_contest_ratings: 'mdi:chart-bell-curve-cumulative',
  update_contestants_performance: 'mdi:chart-timeline-variant',
  send_notification: 'mdi:bell-plus-outline',
  show_contest_problems: 'mdi:eye-outline',
  hide_contest_problems: 'mdi:eye-off-outline',
  publish: 'mdi:publish',
  draft: 'mdi:file-edit-outline',
  hide: 'mdi:eye-off-outline',
  make_hidden: 'mdi:eye-outline',
  make_unhidden: 'mdi:eye-off-outline',
  make_in_queue: 'mdi:playlist-plus',
  rejudge: 'mdi:refresh',
  resubmit_task: 'mdi:restart-alert',
  mark_processing: 'mdi:package-variant',
  mark_shipped: 'mdi:truck-delivery-outline',
  mark_completed: 'mdi:package-variant-closed-check',
  mark_cancelled: 'mdi:cash-refund',
};

export const actionIcon = (action: AdminAction) =>
  actionIcons[action.name] ??
  (action.kind === 'export' ? 'mdi:download-outline' : 'mdi:play-outline');
