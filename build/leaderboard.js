// leaderboard.js

// -------- Helper functions (ported from leaderboardLib.tsx) --------
function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / (arr.length || 1)
}

function fmt(num) {
    return Number(num.toFixed(1))
}

function getPassAt1(results, model, start, end) {
    const filtered = results.filter(
        (r) => r.model === model && r.date >= start && r.date <= end
    )

    const m = (f) => fmt(mean(filtered.filter(f).map((r) => r["pass@1"])) || 0)
    const all = fmt(mean(filtered.map((r) => r["pass@1"])) || 0)
    return {
        average_pass: all,
        easy_pass: m((r) => r.difficulty === "easy"),
        medium_pass: m((r) => r.difficulty === "medium"),
        hard_pass: m((r) => r.difficulty === "hard"),
    }
}

function buildLeaderboard(data, start, end) {
    const { performances, models } = data
    const rows = models
        .filter((m) => m.release_date)
        .map((model) => {
            const { average_pass, easy_pass, medium_pass, hard_pass } = getPassAt1(
                performances,
                model.model_repr,
                start,
                end
            )
            return {
                Model: model.model_repr,
                "Cutoff": new Date(model.release_date).toLocaleDateString(),
                Contaminated: model.release_date >= start,
                "Pass@1": isNaN(average_pass) ? -1 : average_pass,
                "Easy-Pass@1": isNaN(easy_pass) ? -1 : easy_pass,
                "Medium-Pass@1": isNaN(medium_pass) ? -1 : medium_pass,
                "Hard-Pass@1": isNaN(hard_pass) ? -1 : hard_pass,
                link: model.link,
            }
        })
        .sort((a, b) => b["Pass@1"] - a["Pass@1"])

    // assign ranks skipping contaminated
    let rank = 1
    rows.forEach((row) => {
        row.Rank = row.Contaminated ? null : rank++
    })
    return rows
}

function colDefs() {
    return [
        { field: "Rank", maxWidth: 80 },
        {
            field: "Model",
            flex: 2,
            cellRenderer: (params) => {
                const link = params.data.link
                return link ? `<a href="${link}" target="_blank">${params.value}</a>` : params.value
            },
        },
        { field: "Pass@1", sort: "desc" },
        { field: "Easy-Pass@1" },
        { field: "Medium-Pass@1" },
        { field: "Hard-Pass@1" },
    ]
}

// -------- UI ----------
const gridDiv = document.getElementById("grid")
const dataSelect = document.getElementById("dataSelect")
const sliderLabel = document.getElementById("sliderLabel")

// init AG-Grid
const gridOptions = {
    columnDefs: colDefs(),
    defaultColDef: { flex: 1, sortable: true, resizable: true },
    rowClassRules: {
        contaminated: (params) => params.data.Contaminated,
    },
}
new agGrid.Grid(gridDiv, gridOptions)

dataSelect.addEventListener("change", () => loadAndRender())

async function loadAndRender() {
    try {
        const file = dataSelect.value
        console.log('Loading:', file)
        const res = await fetch(file)
        if (!res.ok) {
            throw new Error(`Failed to fetch ${file}: ${res.status}`)
        }
        const data = await res.json()
        console.log('Data loaded:', data)

        // Build slider once per dataset
        buildSlider(data)
        // Render grid initially with default range
        const marks = data.date_marks.sort()
        const start = marks[Math.floor(marks.length * 0.3)]
        const end = marks[marks.length - 1]
        renderLeaderboard(data, start, end)
    } catch (error) {
        console.error('Error loading data:', error)
        sliderLabel.textContent = `Error: ${error.message}`
    }
}

function renderLeaderboard(data, start, end) {
    const rows = buildLeaderboard(data, start, end)
    gridOptions.api.setRowData(rows)
}

// ---- Slider ------
let slider
function buildSlider(data) {
    const marks = data.date_marks.sort()
    const min = marks[0]
    const max = marks[marks.length - 1]
    if (slider && slider.noUiSlider) {
        slider.noUiSlider.destroy()
    }

    slider = document.getElementById("dateSlider")
    noUiSlider.create(slider, {
        start: [marks[Math.floor(marks.length * 0.3)], max],
        connect: true,
        range: { min, max },
        step: 24 * 3600 * 1000, // 1 day in ms
        tooltips: [formatDate, formatDate],
    })

    slider.noUiSlider.on("update", () => {
        const [start, end] = getSliderRange()
        sliderLabel.textContent = `${marks.length} dates | Window: ${formatDate(start)} – ${formatDate(end)}`
    })

    slider.noUiSlider.on("change", () => {
        const [start, end] = getSliderRange()
        fetch(dataSelect.value)
            .then((r) => r.json())
            .then((d) => renderLeaderboard(d, start, end))
            .catch(err => console.error('Slider change error:', err))
    })
}

function formatDate(val) {
    return new Date(+val).toLocaleDateString()
}

function getSliderRange() {
    if (!slider || !slider.noUiSlider) return [0, 0]
    return slider.noUiSlider.get().map((v) => +v)
}

// initial load
loadAndRender() 