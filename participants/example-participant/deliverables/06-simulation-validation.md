# 6. Simulation & Validation

## Simulation Tools Used

- [ ] Wokwi (firmware + circuit)
- [ ] LTspice (analog simulation)
- [ ] Falstad (circuit visualization)
- [ ] TinkerCAD Circuits
- [ ] Other: ___________

**Primary simulation link:** [Wokwi project URL / N/A]

---

## Test 1 — Normal Operation

**Goal:** Verify the device correctly detects [condition] and triggers [output].

**Setup:**
- [Describe simulation setup or bench test]
- Input: [What you applied to the sensor/input]

**Expected behavior:**
- [State machine transitions to ALERT within X seconds]
- [LED/buzzer activates]

**Result:**
> [Pass / Fail — describe what you observed]

**Screenshot:**
> `![Test 1 Screenshot](./test-1-normal-operation.png)`

---

## Test 2 — False Positive Rejection

**Goal:** Verify the device does NOT trigger on [non-event condition].

**Setup:** [Describe]

**Result:**
> [Pass / Fail — describe]

---

## Test 3 — Power Budget Validation

**Goal:** Confirm estimated average current draw meets the design target.

| Measurement | Expected | Measured | Tool |
|-------------|----------|----------|------|
| Sleep current | XμA | XμA | Multimeter / Wokwi |
| Active current peak | XmA | XmA | Multimeter |
| Avg current @ X% duty | XμA | XμA | Calculated |

**Screenshot / scope capture:**
> `![Power Measurement](./power-measurement.png)`

---

## Test 4 — Twist Constraint Verification

**Twist applied:** [ID — Name]

**How verified:**
> [Describe specifically how you proved the twist constraint is met, e.g., "BOM screenshot showing $14.73 total", "all logic paths trace to analog comparator outputs", "device fits inside 100mm cube — see photo"]

**Evidence:**
> `![Twist Evidence](./twist-verification.png)`

---

## Known Limitations

| Limitation | Severity | Mitigation |
|------------|----------|------------|
| [e.g., PIR has ~3m dead zone directly below] | Low | [Aim sensor at 45°] |
| [e.g., not tested at temperatures below 0°C] | Medium | [Out of scope for MVP] |

---

## What Would Be Tested Next (If More Time)

- [ ] Long-duration battery life test (48h+)
- [ ] Environmental stress test (humidity, heat)
- [ ] User testing with target demographic
- [ ] EMC / FCC pre-compliance scan
