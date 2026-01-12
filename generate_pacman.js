const fs = require('fs');

// --- Configuration ---
const boxSize = 10;
const gap = 4;
const cols = 53;
const rows = 7;
const speed = 200; // pixels per second (approx) - used to calculate duration
const stepDuration = 0.2; // seconds per step (movement between cells)
const pauseAtEnd = 3; // seconds to wait before looping
const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']; // GitHub palette (Light)
const darkColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']; // GitHub palette (Dark)

// --- Data fetching ---
async function getContributions(username) {
    if (!username) {
        console.log("No username provided, using mock data.");
        return null;
    }

    try {
        const response = await fetch(`https://github.com/users/${username}/contributions`);
        const text = await response.text();

        // Parse the SVG/HTML response for data-level
        // Structure: <rect ... data-level="X" ... >
        // We expect plenty of rects. We need the LAST 53 columns * 7 rows = 371 rects ?
        // Actually, the graph usually has 53 weeks.

        const regex = /data-level="(\d+)"/g;
        const matches = [...text.matchAll(regex)].map(m => parseInt(m[1]));

        if (matches.length === 0) {
            console.error("Could not find contribution data. Is the username correct?");
            return null;
        }

        console.log(`Found ${matches.length} days of history.`);

        // We need 53 columns x 7 rows = 371 cells.
        // The matches are usually ordered by column then row (or row then column? No, usually column-major in SVG for weeks)
        // GitHub's SVG structure: <g transform...> <rect ... y="0" /> <rect ... y="13" /> ... </g>
        // It's grouped by week (columns).
        // So matches should be: Week1Day0, Week1Day1... Week1Day6, Week2Day0...

        // We take the LAST 53*7 entries if there are more (usually 365+ days).
        // We reshape into 53 columns of 7 rows.

        const totalNeeded = cols * rows;
        // Pad if not enough (unlikely for active profiles, but possibly new ones)
        let data = matches;
        if (data.length < totalNeeded) {
            const padding = new Array(totalNeeded - data.length).fill(0);
            data = [...padding, ...data];
        } else {
            // Take the end
            data = data.slice(-totalNeeded);
        }

        const newGrid = [];
        let dataIdx = 0;
        for (let i = 0; i < cols; i++) {
            let col = [];
            for (let j = 0; j < rows; j++) {
                col.push(data[dataIdx] || 0);
                dataIdx++;
            }
            newGrid.push(col);
        }
        return newGrid;

    } catch (e) {
        console.error("Error fetching data:", e);
        return null;
    }
}

// --- Main Execution ---
(async () => {

    const args = process.argv.slice(2);
    const username = args[0];

    const fetchedGrid = await getContributions(username);
    console.log("Grid fetched/mocked");

    const realGrid = fetchedGrid || [
        [0, 0, 0, 0, 0, 0, 4], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [4, 1, 2, 0, 0, 0, 0], [4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0], [4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]
    ];

    // --- Logic (Ported from pacman.md) ---
    let grid = [];
    let targets = [];

    for (let i = 0; i < cols; i++) {
        let col = [];
        for (let j = 0; j < rows; j++) {
            let level = realGrid[i] ? realGrid[i][j] : 0;
            let isActive = level > 0;
            col.push({
                x: i * (boxSize + gap),
                y: j * (boxSize + gap),
                level: level,
                active: isActive,
                id: `cell-${i}-${j}`
            });
            if (isActive) targets.push({ x: i, y: j, level: level });
        }
        grid.push(col);
    }

    // Calculate Path
    let sortedPath = [];
    let currentPos = { x: 0, y: 3 }; // Start position
    let levelsTargets = [[], [], [], [], []];
    targets.forEach(t => levelsTargets[t.level].push(t));

    for (let l = 1; l <= 4; l++) {
        let group = levelsTargets[l];
        while (group.length > 0) {
            let closestIdx = -1;
            let minDist = Infinity;
            for (let i = 0; i < group.length; i++) {
                let d = Math.abs(group[i].x - currentPos.x) + Math.abs(group[i].y - currentPos.y);
                if (d < minDist) { minDist = d; closestIdx = i; }
            }
            let nextTarget = group[closestIdx];
            sortedPath.push(nextTarget);
            currentPos = nextTarget;
            group.splice(closestIdx, 1);
        }
    }

    // --- SVG Generation helper ---

    // We need to build a single <path> for Pacman to follow
    // Start at (0, 3) -> pixel coords
    // The path consists of L (line to) commands.
    // Coords: x = col * (size+gap), y = row * (size+gap)
    const width = cols * (boxSize + gap);
    const height = rows * (boxSize + gap);
    const startPixelX = 0 * (boxSize + gap);
    const startPixelY = 3 * (boxSize + gap);

    let dPath = `M ${startPixelX} ${startPixelY}`;
    let keyTimes = [0];
    let totalSteps = sortedPath.length;
    // We need to calculate total "distance" or steps to normalize keyTimes
    // Actually, simple way: each target visit is one "segment".
    // But we need intermediate points if we want 'manhattan' movement strictly.
    // For CSS `animateMotion`, it just follows the path.
    // The complexity is rotation. `rotate="auto"` works for direction.
    // But we want 0, 90, 180, 270. `rotate="auto"` aligns with tangent.
    // Manhattan path (L commands) naturally has tangents 0, 90, etc.

    let currentPixelX = startPixelX;
    let currentPixelY = startPixelY;
    let pathPoints = [{ x: startPixelX, y: startPixelY }];

    // We need to interpolate the path to be strictly Manhattan (Turn at corners)
    sortedPath.forEach(target => {
        let targetPixelX = target.x * (boxSize + gap);
        let targetPixelY = target.y * (boxSize + gap);

        // Move X first or Y first?
        // Let's bias towards whatever is longer or just always X then Y
        if (targetPixelX !== currentPixelX) {
            dPath += ` L ${targetPixelX} ${currentPixelY}`;
            pathPoints.push({ x: targetPixelX, y: currentPixelY });
        }
        if (targetPixelY !== currentPixelY) {
            dPath += ` L ${targetPixelX} ${targetPixelY}`;
            pathPoints.push({ x: targetPixelX, y: targetPixelY });
        }

        currentPixelX = targetPixelX;
        currentPixelY = targetPixelY;
    });

    // Return to start (optional, lets reset) or just end there.
    // Move off screen to the right
    const exitX = width + 50;
    dPath += ` L ${exitX} ${currentPixelY}`;
    pathPoints.push({ x: exitX, y: currentPixelY });

    const totalAnimationDuration = pathPoints.length * stepDuration;

    // --- CSS for Cells ---
    // Each cell needs to disappear when Pacman hits it.
    // We can use `animation-delay`.
    // We need to map "when does pacman reach cell(x,y)?"
    // pathPoints index roughly maps to time.
    // Note: pathPoints includes corners.
    // sortedPath is the ordered list of targets.

    // Refined Logic for Cell timing:
    // We simulate the walk matching the SVG path exactly to find timestamps.

    let cellTimings = {}; // "x-y": timeOffset
    let currentTime = 0;
    let simX = startPixelX;
    let simY = startPixelY;

    sortedPath.forEach(target => {
        let tx = target.x * (boxSize + gap);
        let ty = target.y * (boxSize + gap);

        // Distances
        let dx = Math.abs(tx - simX);
        let dy = Math.abs(ty - simY);

        // Time taken for this segment (simple assumption: constant speed)
        // Actually, animateMotion with calcMode="linear" moves at constant speed relative to path length?
        // No, keyTimes are needed if segments vary in length.
        // However, if we assume stepDuration per "move", it's easier.

        // Let's assume constant linear speed.
        // Total distance of path:

    });

    function dist(p1, p2) { return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y); }

    let totalDistance = 0;
    for (let i = 1; i < pathPoints.length; i++) {
        totalDistance += dist(pathPoints[i - 1], pathPoints[i]);
    }

    const speedPxPerSec = 50;
    const animDuration = totalDistance / speedPxPerSec;

    // Now find when each target is hit
    let traversedDist = 0;
    let currentPointIndex = 0; // index in pathPoints

    // Map each target to a distance along the path
    sortedPath.forEach(target => {
        let tx = target.x * (boxSize + gap);
        let ty = target.y * (boxSize + gap);
        // Find when we hit this coordinate in the path
        // It must be one of the pathPoints (since we added them for every target)
        // We scan forward from currentPointIndex

        for (let i = currentPointIndex + 1; i < pathPoints.length; i++) {
            let p1 = pathPoints[i - 1];
            let p2 = pathPoints[i];
            let d = dist(p1, p2);
            traversedDist += d;

            // Check if p2 is our target (or p1, but p1 is start of segment)
            if (p2.x === tx && p2.y === ty) {
                let timeRatio = traversedDist / totalDistance;
                let timeSec = timeRatio * animDuration;
                cellTimings[`${target.x}-${target.y}`] = timeSec;
                currentPointIndex = i;
                break;
            }
        }
    });


    // SVG Components using previously defined width/height
    const svgWidth = width + 20;
    const svgHeight = height + 20;

    // Extend duration slightly for the reset phase
    const loopDuration = animDuration + 1.0;

    let svgContent = `
<svg width="${svgWidth}" height="${svgHeight}" viewBox="-10 -10 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
<rect x="-10" y="-10" width="${width}" height="${height}" fill="#0d1117" />
<g transform="translate(0,0)">
`;

    // Draw Grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cell = grid[i][j];
            let color = darkColors[cell.level];

            let animations = "";
            let timing = cellTimings[`${i}-${j}`];

            if (cell.active && timing !== undefined) {
                // Calculate keyTimes for SMIL
                // Sequence: 0 -> eatTime (visible) -> eatTime (disappear) -> end (reset)
                // We use opacity: 1 -> 1 -> 0.2 -> 0.2 -> 1

                let t = timing / loopDuration;
                let tEat = Math.min(t + 0.01, 0.99); // small step to disappear
                let tReset = 0.95; // start resetting near end

                // Ensure times are strictly increasing and within 0-1
                // 0 ... t ... tEat ... tReset ... 1

                if (tEat >= tReset) tReset = tEat + 0.001;

                // Opacity Animation
                // values="1; 1; 0.2; 0.2; 1"
                // keyTimes="0; t; tEat; tReset; 1"
                animations += `<animate attributeName="opacity" values="1;1;0.2;0.2;1" keyTimes="0;${t.toFixed(3)};${tEat.toFixed(3)};${tReset};1" dur="${loopDuration.toFixed(2)}s" repeatCount="indefinite" />`;

                // Fill Animation (Optional, matching original style)
                animations += `<animate attributeName="fill" values="${color};${color};#1b2028;#1b2028;${color}" keyTimes="0;${t.toFixed(3)};${tEat.toFixed(3)};${tReset};1" dur="${loopDuration.toFixed(2)}s" repeatCount="indefinite" />`;
            }

            svgContent += `<rect x="${cell.x}" y="${cell.y}" width="${boxSize}" height="${boxSize}" fill="${color}" rx="2">${animations}</rect>`;
        }
    }

    svgContent += `</g>`;

    // Draw Pacman
    svgContent += `
<g>
    <animateMotion dur="${loopDuration.toFixed(2)}s" repeatCount="indefinite" path="${dPath}" rotate="auto">
    </animateMotion>
    
    <g transform="rotate(0)"> <!-- Adjust initial rotation if needed -->
        <circle cx="0" cy="0" r="4" fill="#FFD700" />
        <path d="M0,0 L5,-3 L5,3 Z" fill="#0d1117">
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="30 0 0" dur="0.2s" repeatCount="indefinite" values="0 0 0; 30 0 0; 0 0 0" keyTimes="0; 0.5; 1" />
        </path>
    </g>
</g>
`;

    svgContent += `</svg>`;

    fs.writeFileSync('pacman.svg', svgContent);
    console.log(`Generated pacman.svg with duration ${animDuration.toFixed(2)}s`);

})();
