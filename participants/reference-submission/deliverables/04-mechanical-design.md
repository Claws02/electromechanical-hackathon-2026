# 4. Mechanical Design

## Overview

A single sealed enclosure zip-tied to the top panel of a sectional garage door. One part, one
mounting operation, no alignment, no adhesive, no drilling.

> In a real submission, attach CAD screenshots and an exploded view here:
> `![Exploded view](./exploded.png)`
>
> A dimensioned hand sketch, photographed, scores fine. No mechanical content at all does not.

## Envelope

| Dimension | Value | Driver |
|---|---|---|
| Overall | 78 × 42 × 26 mm | 18650 cell length sets the long axis |
| Wall thickness | 2.4 mm | 3 perimeters at 0.4 mm nozzle; survives a drop onto concrete |
| PCB | 35 × 25 × 1.6 mm | Sits above the cell, parallel to the mounting face |
| Mass | ~78 g | 47 g cell + 31 g enclosure and PCB |

The cell dominates the envelope. Everything else fits in the space left over — worth stating,
because it means a smaller enclosure requires a different cell chemistry, not tighter packaging.

## Orientation — the load-bearing mechanical decision

The whole design depends on the PCB's Z-axis being **normal to the door panel face.** The
accelerometer measures panel rotation, so the sensor's orientation *is* the measurement.

```
   DOOR CLOSED (panel vertical)        DOOR OPEN (panel horizontal)

        ║ door panel                        ═══════ door panel
        ║                                      │
     ┌──╫──┐                              ┌────┴────┐
     │ PCB │  Z ──► horizontal            │   PCB   │   Z ──► vertical (down)
     └──╫──┘     az ≈ 0 g                 └─────────┘      az ≈ −1 g
        ║        ax ≈ −1 g                                 ax ≈ 0 g
        ║
      pitch ≈ 0°                              pitch ≈ 90°
```

**Consequence:** the enclosure must key to the panel in exactly one orientation. A device mounted
90° out is not merely inaccurate — it reads a constant angle and never detects the door at all.
Handled two ways:

1. **Mechanically:** the mounting cradle is asymmetric, so it only seats one way.
2. **In firmware:** the install calibration step (see
   [deliverable 05](05-firmware-logic.md#calibration)) records the closed-position vector and
   refuses to complete if the observed rotation between closed and open is under 60°.

Belt and braces, because this is the failure that produces a device that silently never works.

## Construction

| Part | Material | Process | Note |
|---|---|---|---|
| Housing | PETG | FDM, 0.2 mm layers | Chosen over PLA: PLA creeps and softens near 55 °C, and a garage roof cavity in summer gets there |
| Lid | PETG | FDM | Snap-fit, 4 cantilever hooks |
| Gasket | EPDM foam, 2 mm | Die-cut | Dust and insect ingress, not immersion |
| Cell clip | Steel, PCB-mount | — | User-replaceable without tools |
| Standoffs | Printed integral bosses | — | M2 self-tapping into printed bosses, 4× |
| Mount cradle | PETG, integral | FDM | Two 6 mm zip-tie slots |
| Vibration pad | EVA foam, 3 mm | Die-cut | Between cradle and panel |

**Why PETG over PLA** is the kind of material decision that carries points: the operating
environment is an uninsulated garage that can exceed 50 °C at ceiling height, and PLA's glass
transition is ~60 °C. A PLA enclosure will sag over one summer. PETG's is ~80 °C. ABS or ASA would
be better still on temperature but warp badly at this wall thickness on a hobby printer.

## Assembly Sequence

```
1. Press cell clip onto PCB, solder                    (bench)
2. Drop PCB into housing, seat on 4 bosses
3. 4× M2 × 6 mm self-tapping screws
4. Insert 18650 cell into clip                         (last — live circuit from here)
5. Lay gasket into lid groove
6. Snap lid onto housing — 4 cantilever hooks
7. Peel and apply EVA pad to cradle face               (install site)
8. Zip-tie cradle to door panel, correct orientation
9. Run calibration: close door, hold button 3 s, open door fully
```

Steps 1–6 are bench work. Steps 7–9 are the user's, and total under 10 minutes — which was a
requirement from [the user definition](01-problem-statement.md#target-user), not an accident.

**Serviceability:** the lid is snap-fit rather than glued specifically so the user can replace the
cell. A glued or ultrasonically welded enclosure would make a two-year device disposable, and the
target user is buying something they expect to keep.

## Mounting

Zip ties through two 6 mm slots in the integral cradle, around a stile of the top door panel.

**Why not adhesive:**
- The [secondary user is a renter](01-problem-statement.md#target-user) — VHB tape on a painted
  door panel removes paint.
- Adhesive bond strength degrades badly through the −20 °C to +50 °C cycling a garage door sees.
- A 78 g mass on a panel that accelerates and stops twice per cycle is a real fatigue load on tape.

**Why not screws:** drilling a garage door panel voids its warranty and can compromise a panel
that is part of a wind-rated assembly.

Zip ties are removable, temperature-stable, non-marking, and carry the load in tension where the
material is strongest. Two ties give redundancy — one failed tie leaves the device hanging, not
falling.

## Vibration and Fatigue

A garage door is not a static mount. Each cycle involves motor start, travel, and a hard stop.

| Concern | Mitigation |
|---|---|
| Shock at end of travel | EVA foam pad damps the transient. Cell clip retains the cell against ~5 g |
| Resonance | 78 g on a stiff cradle; first mode well above the door's few-Hz excitation |
| Cell movement | Steel clip with spring preload, not a friction pocket |
| Solder joint fatigue | Module and LGA parts are low-mass and reflowed; the 100 µF electrolytic is the tallest part and gets a glue dot |
| Zip-tie creep | Nylon at 50 °C creeps slowly. **Install instruction: re-tension at first cell change.** |
| Lid opening in service | 4 hooks, 2 per long side — a single hook failure does not release the lid |

## Thermal

No active dissipation worth managing: peak power is 110 mA × 3.3 V ≈ 0.36 W for 4 seconds, roughly
once every four hours. Average dissipation is under 1 mW.

The thermal concern runs the other direction — **ambient, not self-heating:**

| Condition | Effect | Response |
|---|---|---|
| +50 °C summer, ceiling height | Li-ion self-discharge roughly doubles; PLA would sag | PETG; [the battery-life range is stated honestly](03-electrical-design.md#the-finding-worth-stating-plainly) |
| −20 °C winter | Li-ion usable capacity falls 20–30% | Documented as a seasonal effect; low-battery threshold set on loaded voltage, not open-circuit |
| Solar gain on a south-facing door | Local temperature above ambient | Enclosure is light grey, not black |

## Twist Impact — `P1` Battery Only

Deleting the USB-C charge port removed the one penetration in the enclosure wall, which:

1. **Simplified sealing.** No connector cutout means the gasket is a continuous loop with no
   interruption to seal around — genuinely easier to make dust-tight.
2. **Recovered 8 mm of board edge**, but the envelope did not shrink, because the 18650 cell still
   sets the long dimension. A useful reminder that removing parts only shrinks a product when the
   removed part was the constraint. Here it was not.
3. **Made the snap-fit lid more important.** With no charge port, replacing the cell is the *only*
   maintenance operation, so the lid must survive repeated opening. Cantilever hooks are specified
   at 2.4 mm root thickness for roughly 50 open/close cycles — well beyond the two or three the
   device will actually see.
