const form = document.getElementById('front-end-form');

form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=front]:checked').value;
    const data = { frontend: choice};
    fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
    e.preventDefault();
});

fetch('http://localhost:3000/poll')
.then(res => res.json())
.then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    // Count vote points -accum, current params
    console.log(totalVotes);
    const voteCounts = votes.reduce(
        (accum, vote) => 
        ((accum[vote.frontend] = (accum[vote.frontend] || 0) + parseInt(vote.points)), accum), {});
    console.log(voteCounts);
    let dataFrontEndPoints = [
        { label: 'Android', y: voteCounts.Android},
        { label: 'AngularJS', y: voteCounts.AngularJS},
        { label: 'iOS', y: voteCounts.iOS},
        { label: 'BackboneJS', y: voteCounts.BackboneJS},
        { label: 'VanillaJS', y: voteCounts.VanillaJS},
        { label: 'JQuery', y: voteCounts.JQuery},
        { label: 'ReactJS', y: voteCounts.ReactJS}
    ];
    const chartFrontEndContainer = document.querySelector('#chartFrontEndContainer');

    if (chartFrontEndContainer) {
        const chart = new CanvasJS.Chart('chartFrontEndContainer', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Front-End Results ${totalVotes}`
            },
            data: [
                {
                    type: 'column',
                    dataPoints: dataFrontEndPoints
                }
            ]
        });
        chart.render();

        // Enable pusher logging - don't include this in production
    //    Pusher.logToConsole = true;

        var pusher = new Pusher('3d765e9a6c14a9de88ee', {
        cluster: 'ap1',
        encrypted: true
        });

        var channel = pusher.subscribe('front-end-poll');
        channel.bind('front-end-vote', function(data) {
        //  alert(data.message);
            dataFrontEndPoints = dataFrontEndPoints.map(x => {
                console.log(x);
                console.log(data);
                if (x.label == data.frontend) {
                    x.y += data.points;
                    return x;
                }
                else {
                    return x;
                }
            });
            chart.render();
        });
    }
});


