/**
 * Demo dataset: an internal moderation tool, four weeks after launch.
 * The precomputed scorecard (demo-scorecard.json) and pitches
 * (demo-pitches.json) are written against these exact inputs; feedback
 * IDs are the zero-based line index of SAMPLE_FEEDBACK.
 */

export const SAMPLE_PROJECT_NAME = "Moderation Queue Tool v1";

export const SAMPLE_GOALS = [
  "Moderators can review and tag an item in under 30 seconds.",
  "Escalated sensitive content reaches the risk & response team within 5 minutes.",
  "Moderators only see queues they're authorized for.",
  "Policy tags are clear and consistent across moderators.",
  "Team leads can see queue volume in real time to plan staffing.",
].join("\n");

export const SAMPLE_FEEDBACK = [
  "[Slack] Escalated a self-harm livestream at 2:14pm and R&R didn't pick it up until 2:41. That's 27 minutes on something that should take 5.",
  "[Sync] Team leads report escalations sit in a shared inbox with no alerting — R&R only sees them when someone refreshes the page.",
  "[Widget] I hit Escalate and nothing confirms it went through. I end up pinging R&R on Slack to double-check, which defeats the point.",
  "[Observation] Watched a moderator escalate a child-safety item, then wait about 12 minutes before messaging the R&R on-call directly because the tool showed no acknowledgment.",
  "[Slack] Overnight escalations are the worst. R&R has one person on after 10pm and the tool doesn't page them. Saw a 40-minute gap last Tuesday.",
  "[Sync] R&R lead says they can't tell which escalations are most severe; everything lands in one list sorted by time, not risk.",
  "[Widget] Escalate is buried in the '...' menu. Three clicks for the most time-sensitive thing I do.",
  "[Sync] Team leads say the volume dashboard lags 15–20 minutes behind the actual queue, so staffing calls get made on stale numbers.",
  "[Slack] We only have about 3 trained moderators per queue. When one calls out, I can't see the backlog building until it's already 200+ deep.",
  "[Sync] Leads like having a dashboard at all (much better than the spreadsheet) but need volume by queue and by hour to plan shifts.",
  "[Observation] Team lead kept the old staffing spreadsheet open next to the dashboard to cross-check numbers during morning standup.",
  "[Widget] Love that I only see the queues I'm trained for now. Way less noise.",
  "[Sync] No access incidents reported since launch. Permission requests route through leads and take about a day, which everyone is fine with.",
  "[Slack] New hire onboarding was smooth. She only saw the Spam queue until she finished graphic content training. Exactly what we wanted.",
  "[Sync] Median review-and-tag time is around 22 seconds on standard items, down from roughly 45 in the old tool.",
  "[Widget] Video preview loads fast and the tag panel is right next to it. Much quicker than before.",
  "[Observation] Moderator cleared short-form clips in 15–25 seconds each; longer videos took closer to a minute, which the team considers expected.",
  "[Slack] Is 'graphic violence' vs 'violent extremism' about intent or content? Three of us tagged the same video three different ways today.",
  "[Sync] QA found about 12% disagreement between the 'harassment' and 'bullying' tags in last week's audit sample.",
  "[Widget] The tag descriptions on hover are really helpful for the newer tags.",
  "[Widget] Policy tag list is too long. I scroll past 30 tags to find 'spam'.",
  "[Widget] Please add keyboard shortcuts. Clicking for every tag and every 'next' is killing my wrist by hour six.",
  "[Observation] Every moderator observed reached for the mouse for every action: approve, tag, next. Two were wearing wrist braces.",
  "[Slack] The old tool had J/K to move between items and number keys for tags. We lost all of that in v1.",
  "[Slack] Tool froze for about 2 minutes during the Saturday night livestream spike. Couldn't load any videos.",
  "[Sync] During big live events the queue view takes 10+ seconds to load each item, and moderators fall behind fast.",
  "[Widget] Getting 'Something went wrong' every time traffic jumps. I have to refresh and I lose my place in the queue.",
].join("\n");
