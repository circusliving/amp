# Task: Compile Master Issue List

**ID:** p03-07
**Status:** pending
**Depends on:** p03-06
**Context size:** large

## Goal

Compile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeCompile every issue discovered across Phase 02 and Phase 03 into a single, numbered, categorizeComhe description

3. **Categorize all issues** by type:
   - Layout & Structure
   - Content & Data
   - Images & Media
   - Icons & Fonts
   - Navigation & Links
   - Typography & Colors
   - Spacing & Alignment
   - SEO & Meta
   - Console & Network Errors
   - Accessibility
   - Responsive
   - Functionality

4. **Prioritize all issues** by severity:
   - **Critical:** Page broken, cannot use, data missing entirely
   - **Major:** Significant visual or functional difference
   - **Minor:** Noticeable but doesn't block usage
   - **Cosmetic:** Small visual difference, polish item

5. **Write the master issue list** to `issues.md` in the plan root:

   ```markdown
   # Migration Issues — Master List

   **Total issues:** NN
   **Generated:** YYYY-MM-DDTHH:MM:SSZ

   ## Summary

   | Category | Critical | Major | Minor | Cosmetic | Total |
   |----------|----------|-------|-------|----------|-------|
   | Layout   | N        | N     | N     | N        | N     |
   | ...      | ...      | ...   | ...   | ...      | ...   |
   | **Total** | **N**   | **N** | **N** | **N**    | **NN**|

   ## Issues by Category

   ### Layout & Structure

   #### Issue #1: [Title]
   - **Page:** /path
   - **Severity:** critical
   - **Live:** ...
   - **Local:** ...
   - **Root cause:** ...
   - **Screenshot:** ...

   ...
   ```

6. **Update `checkpoint.md`** with plan completion status.

7. **Create a summary** for the user:
   - Total issue count
   - Breakdown by severity
   - Top 5 most impactful issues
   - Recommended fix order (critical → major → minor → cosmetic)

## Outputs

- `issues.md` — The master issue list (the primary deliverable)
- Updated `checkpoint.md`
- Summary for user

## Done When

- [ ] All issues from all tasks collected
- [ ] Issues deduplicated and verified
- [ ] Issues categorized and prioritized
- [ ] `issues.md` written with complete list
- [ ] Summary with counts and priorities produced
- [ ] `checkpoint.md` updated to plan complete

## Handoff

This is the final task. The `issues.md` file is the deliverable that will drive the fix plan.
