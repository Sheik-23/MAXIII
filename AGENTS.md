# MAXIII: Project Context

## 1. What MAXIII is

MAXIII is a mobile nutrition-tracking app for the Indian market. It tracks calories and macros accurately for **home-cooked Indian food** (sambar, dal, phulka, rice, curries), which Western calorie apps usually get wrong.

The name means "maximise your gains". "Gains" means more than muscle: protein hit, steady weight loss, fibre goal, logging streak.

## 2. Who it is for

- **Primary:** serious gym-goers and lifters in India (they track for months and care about accuracy).
- **Secondary:** everyday Indian users who eat home-cooked food.

## 3. The edge (what makes it different)

1. **Yield engine:** converts raw ingredients + oil + total cooked weight into nutrition per gram of the finished dish.
2. **Indian portions:** katori, ladle, phulka, etc., with grams-per-unit stored per food.
3. **Regional-language search:** English, Tamil, Hindi, Telugu.
4. **Works offline:** the food database is on the phone (SQLite).
5. **Lifter features:** batch-cook logging, cut/bulk/maintain goals, protein per kg bodyweight, training-day vs rest-day targets, adaptive TDEE (MacroFactor-style), weekly report.

## 4. Business model

- **Hard paywall with a free trial. There is no free tier.**
- Trial: 7 days of full access, no payment up front (implementation detail still open: store-managed trial vs own backend trial).
- After the trial, a subscription is required to keep using the app.
- Planned price: about Rs. 199/month and an annual plan about Rs. 1,499 (to be confirmed).
- Subscriptions managed with RevenueCat.
- Users' saved data is **never deleted**, even if the subscription lapses.
- Marketing after launch: fitness influencers with referral codes, regional-language Reels, and one SEO page per dish.

## 5. Tech stack (decided)

| Area | Choice |
|---|---|
| App | **React Native + Expo** (TypeScript, strict mode), Expo Router |
| Platforms | iOS and Android from one codebase |
| On-device data | SQLite (expo-sqlite), offline-first |
| Backend | Node.js + Express |
| Database/auth | Supabase (PostgreSQL) |
| Subscriptions | RevenueCat |
| Tests | Jest + ts-jest (TypeScript 5) |

Do **not** use Next.js for the mobile app. It is web-only.

## 6. Food data rules (important)

- Every food row must have a `source` column (e.g. `USDA`, `IFCT`, `own_measurement`, `label`).
- **IFCT 2017 (ICMR-NIN) is copyrighted. Do not bundle IFCT data** until written commercial-use permission is received. Permission is requested and pending.
- Current plan: USDA FoodData Central + the developer's own measured cooking yields.
- Nutrition per 100 g of the raw ingredient: kcal, protein, carbs, fat, fibre (micronutrients later).
- Data quality check: kcal should roughly equal 4*protein + 4*carbs + 9*fat (`atwaterDifference` helper).
- Never hardcode nutrition numbers inside screens. They come from the database.

## 7. Existing code

`yieldEngine.ts` (+ `yieldEngine.test.ts`) is done and tested. Key functions:
- `calculateRecipe(input)` returns totals, per 100 g cooked, per gram, per serving.
- `nutritionForPortion(result, grams)`
- `atwaterDifference(nutrients)`

Reference test: 100 g toor dal (335 kcal) + 10 g oil at 9 kcal/g = 425 kcal total. The dal values in the tests are **example data, not verified**.

## 8. MVP scope (build in this order)

1. Expo project setup (TypeScript, Expo Router, folder structure)
2. SQLite food table with `source` column, seeded with about 150 staples
3. Yield engine wired to the UI
4. Logging screen: search, grams, daily totals
5. Recipe builder: ingredients, oil added, oil left in pan, total cooked weight, servings
6. Targets: calories and protein per kg bodyweight
7. Accounts, paywall and trial (RevenueCat), then adaptive TDEE and weekly report

## 9. Not in scope yet

Marketplace, AI coach, video analysis, barcode scanner, trainer dashboard. Do not build these until the MVP is working.

## 10. Coding rules for the AI tool

- TypeScript strict mode. Small, pure, testable functions for all nutrition maths.
- **Every change to nutrition calculations needs a unit test.** Never change the maths without running `npm test`.
- Logging must be fast: recent meals, favourites, "copy yesterday".
- Weigh by grams first; household measures (katori etc.) are a backup that uses stored grams-per-unit.
- Do not make accuracy claims like "97% accurate" in the UI or copy. Use "calculation accuracy when ingredients are weighed".
- Health safety: calorie floors, no aggressive deficits, a short "not medical advice" notice.
- Privacy: weight and food logs are personal data. Follow India's DPDP Act (clear consent, deletion option).
- Ask before adding a new dependency. Prefer Expo-supported libraries.
- Show complete corrected files, not fragments, when fixing bugs.

## 11. Founder

Solo developer (full-stack, React/Node), working about 10-15 hours a week. Prefers short, direct answers and complete code blocks.
