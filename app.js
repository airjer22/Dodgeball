// ... (keep existing code)

function showCalendar(tournamentId) {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let html = `
        <h2>${tournament.name} - Calendar</h2>
        <div id="calendar" class="calendar">
            ${generateCalendarDays(currentYear, currentMonth, tournament)}
        </div>
        <div id="matchList" class="match-list">
            <h3>Unscheduled Matches</h3>
            ${generateMatchList(tournament)}
        </div>
    `;
    mainContent.innerHTML = html;

    // Add event listeners for drag and drop
    addDragAndDropListeners();
}

function generateCalendarDays(year, month, tournament) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let html = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        html += '<div class="calendar-day"></div>';
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        html += `
            <div class="calendar-day" data-date="${year}-${month + 1}-${day}" ondrop="drop(event)" ondragover="allowDrop(event)">
                ${day}
                <div class="day-matches"></div>
            </div>
        `;
    }

    return html;
}

function generateMatchList(tournament) {
    return tournament.matches.map(match => `
        <div class="match-item" draggable="true" ondragstart="drag(event)" data-match='${JSON.stringify(match)}'>
            ${match.team1} vs ${match.team2}
        </div>
    `).join('');
}

function addDragAndDropListeners() {
    const matchItems = document.querySelectorAll('.match-item');
    matchItems.forEach(item => {
        item.addEventListener('dragstart', drag);
    });

    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('dragover', allowDrop);
        day.addEventListener('drop', drop);
    });
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.match);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const matchData = JSON.parse(event.dataTransfer.getData("text/plain"));
    const dayElement = event.target.closest('.calendar-day');
    const date = dayElement.dataset.date;

    // Create a new element for the dropped match
    const matchElement = document.createElement('div');
    matchElement.className = 'scheduled-match';
    matchElement.textContent = `${matchData.team1} vs ${matchData.team2}`;

    // Add the match to the day's matches
    dayElement.querySelector('.day-matches').appendChild(matchElement);

    // Remove the match from the unscheduled list
    event.target.closest('.match-item')?.remove();

    // Update the tournament data (you may want to add more sophisticated logic here)
    const tournamentId = getTournamentIdFromUrl(); // Implement this function
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
        const matchIndex = tournament.matches.findIndex(m => 
            m.team1 === matchData.team1 && m.team2 === matchData.team2);
        if (matchIndex !== -1) {
            tournament.matches[matchIndex].scheduledDate = date;
            saveTournaments();
        }
    }
}

function getTournamentIdFromUrl() {
    // Implement this based on how you're storing the current tournament ID
    // For example, you might use a URL parameter or store it in a variable
    return parseInt(new URLSearchParams(window.location.search).get('tournamentId'));
}

// ... (keep other existing functions)