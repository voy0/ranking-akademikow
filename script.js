//  Kod do indeterminate checkboxow z neta
//  helper function to create nodeArrays (not collections)
const nodeArray = (selector, parent = document) => [].slice.call(parent.querySelectorAll(selector));
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
//  checkboxes of interest 
const allThings = nodeArray('input');

document.getElementById('cb-theroom').indeterminate = true;
document.getElementById('cb-bathroom').indeterminate = true;
document.getElementById('cb-laundry').indeterminate = true;
document.getElementById('cb-cleaning').indeterminate = true;
//  global listener
addEventListener('change', e => {
    let check = e.target;

    //  exit if change event did not come from 
    //  our list of allThings 
    if (allThings.indexOf(check) === -1) return;

    //  check/unchek children (includes check itself)
    const children = nodeArray('input', check.parentNode);
    children.forEach(child => child.checked = check.checked);

    //  traverse up from target check
    while (check) {

        //  find parent and sibling checkboxes (quick'n'dirty)
        const parent = (check.closest(['ul']).parentNode).querySelector('input');
        const siblings = nodeArray('input', parent.closest('li').querySelector(['ul']));

        //  get checked state of siblings
        //  are every or some siblings checked (using Boolean as test function) 
        const checkStatus = siblings.map(check => check.checked);
        const every = checkStatus.every(Boolean);
        const some = checkStatus.some(Boolean);

        //  check parent if all siblings are checked
        //  set indeterminate if not all and not none are checked
        parent.checked = every;
        parent.indeterminate = !every && every !== some;

        //  prepare for nex loop
        check = check != parent ? parent : 0;
    }
});
document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('click', () => {
        displayList(header);
    });
});

function displayList(header) {
    var ulList = header.nextElementSibling;

    if (ulList.hidden) {
        ulList.hidden = false;
    } else {
        ulList.hidden = true;
    }
    rotateDisplayArrow(header);
}

function rotateDisplayArrow(header) {
    var arrow = header.querySelector('.dropdown-arrow');
    if (arrow.style.transform === 'rotate(180deg)') {
        arrow.style.transform = 'rotate(0deg)';
    } else {
        arrow.style.transform = 'rotate(180deg)';
    }
}

function showVal(newVal, id) {
    updateScores();
    document.getElementById('p' + id).innerHTML = newVal;
}
const dormScoring = {
    0: [4.15, 2.39, 4.03],  // DS Akademik
    1: [3.08, 4.52, 2.45],  // Babilon        
    2: [3.51, 4.75, 3],     // Bratniak - Muszelka
    3: [4.81, 3.91, 5],     // Mikrus
    4: [3.5, 4, 3.25],//pineska-tulipan
    5: [4.88, 3.11, 5],     // Riviera
    6: [4.91, 4.69, 2.98],  // Tatrzańska
    7: [2.10, 4.41, 2],      // Ustronie
    8: [3.89, 2.11, 4.82]//zaczek
};
function updateScores() {
    const dormWrappers = document.querySelectorAll('.dormitory-wrapper');

    Wa = document.getElementById('rn-atmosfera').value
    Wc = document.getElementById('rn-czystosc').value
    Wl = document.getElementById('rn-lokalizacja').value

    dormWrappers.forEach(wrapper => {
        const dormId = wrapper.getAttribute('data-dorm-id');
        const scores = dormScoring[dormId];

        if (scores && scores.length === 3) {
            const AscoreElement = wrapper.querySelector('.ds-score-wrapper .ds-score span#Ascore');
            const CscoreElement = wrapper.querySelector('.ds-score-wrapper .ds-score span#Cscore');
            const LscoreElement = wrapper.querySelector('.ds-score-wrapper .ds-score span#Lscore');
            const GscoreElement = wrapper.querySelector('.ds-gscore span#Gscore');

            if (AscoreElement) AscoreElement.textContent = scores[0].toFixed(1);
            if (CscoreElement) CscoreElement.textContent = scores[1].toFixed(1);
            if (LscoreElement) LscoreElement.textContent = scores[2].toFixed(1);
            var averageScore = 0;
            if (GscoreElement) {
                if (Wa != 0 || Wc != 0 || Wl != 0) {
                    averageScore = 20 * (Wa * scores[0] + Wc * scores[1] + Wl * scores[2]) / (Wa + Wc + Wl)
                }
                GscoreElement.textContent = averageScore.toFixed(1);
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", updateScores());
document.addEventListener("DOMContentLoaded", function () {


    // Pobierz wszystkie checkboxy
    const checkboxes = document.querySelectorAll('.complimentary-eq input[type="checkbox"]');

    // Nasłuchuj zmian w checkboxach
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateResults);
    });

    function updateResults() {
        const selectedFeatures = getSelectedFeatures();
        const dorms = document.querySelectorAll('.dormitory-wrapper');
        const sortedDorms = Array.from(dorms).sort((a, b) => {
            const aFeatures = getDormFeatures(a);
            const bFeatures = getDormFeatures(b);
            const aScore = calculateMatchScore(aFeatures, selectedFeatures);
            const bScore = calculateMatchScore(bFeatures, selectedFeatures);
            return bScore - aScore; // Sortuj malejąco według dopasowania
        });
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Wyczyść aktualne wyniki
        sortedDorms.forEach(dorm => {
            resultsContainer.appendChild(dorm); // Dodaj posortowane dormy
        });
    }

    function getSelectedFeatures() {
        const selectedFeatures = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFeatures.push(checkbox.id);
            }
        });
        return selectedFeatures;
    }

    function getDormFeatures(dorm) {
        // Zakładając, że data-dorm-id odzwierciedla funkcje akademika w postaci JSON
        const dormId = dorm.getAttribute('data-dorm-id');

        const dormFeatures = {
            0: ['cb-bedsheets', 'cb-curtains', 'cb-desklamp', 'cb-fridge', 'cb-rsink',
                //kitchen
                'cb-stove', 'cb-oven',
                //bathroom
                'cb-shower', 'cb-toilet',
                //laundry
                'cb-laundrym', 'cb-drier',
                //sale
                'cb-banquet', 'cb-library', 'cb-musicr', 'cb-pingpong', 'cb-gym', 'cb-cinemar', 'cb-studyroom', 'cb-8ball', 'cb-chillr',
                //parking
                'cb-carp', 'cb-bikep',

            ], // Akademik
            1: ['cb-bedsheets', 'cb-bathroom'], // Babilon
            2: ['cb-rj45', 'cb-curtains'], // Bratniak-Muszelka
            3: ['cb-stove', 'cb-oven'], // Mikrus
            4: ['cb-sink', 'cb-shower'], // Pineska-Tulipan
            5: ['cb-laudrym', 'cb-drier', 'cb-stove', 'cb-oven', 'cb-bedsheets', 'cb-desklamp', 'cb-fridge', 'cb-rsink', 'cb-shower', 'cb-toilet', 'cb-banquet', 'cb-chillr', 'cb-studyroom', 'cb-bikep', 'cb-musicr'], // Riviera
            6: ['cb-bedsheets', 'cb-curtains', 'cb-desklamp', 'cb-stove', 'cb-oven', 'cb-rsink', 'cb-shower', 'cb-toilet', 'cb-banquet'], // Tatrzanska
            7: ['cb-bedsheets', 'cb-desklamp', 'cb-fridge', 'cb-rsink', 'cb-shower', 'cb-toilet', 'cb-court', 'cb-rj45', 'cb-urinal', 'cb-steamer', 'cb-iron', 'cb-stove', 'cb-oven', 'cb-studyroom', 'cb-chillr', 'cb-carp', 'cb-bikep', 'cb-cinemar', 'cb-laundrym', 'cb-drier'], // Ustronnie
            8: ['cb-cinemar', 'cb-laundrym', 'cb-drier', 'cb-gym', 'cb-8ball', 'cb-shower', 'cb-toilet', 'cb-stove', 'cb-bedsheets', 'cb-desklamp', 'cb-fridge', 'cb-rsink', 'cb-steamer'], // Zaczek

        };
        return dormFeatures[dormId] || [];
    }

    function calculateMatchScore(dormFeatures, selectedFeatures) {
        let matchScore = 0;
        selectedFeatures.forEach(feature => {
            if (dormFeatures.includes(feature)) {
                matchScore++;
            }
        });
        return matchScore;
    }

});





