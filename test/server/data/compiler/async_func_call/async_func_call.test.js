'@fixture Test fixture';
'@page http://my.page.url';

'@require ./req.js';

function ultraSuperHelperFunc() {
    return 'nothing';
}

window.setTimeout(function () {
    doSmthg();
}, 100);

'@test'['My first test'] = {
    '1.Do smthg cool': function () {
        var foo = 'bar',
            baz = 0;

        for (var i = 0; i < 50; i++)
            baz++;

        setTimeout();
    },

    '2.Stop here': function () {
        act.drag();
    }
};

var someUselessVar = 'blahblahblah';

'@test'['I want more tests!'] = {
    '1.Here we go': function () {
        while (true) {
            var a = 3 + 2;
            console.log('This is infinite loop lol');
        }

        window.setInterval(function () {
            doSmthg();
        }, 100);
    },

    "2.I'm really tired creating stupid names for test steps": function () {
        callSomeUselessFunc();
        act.click();
    },

    '3.This is a final step': function () {
        act.drag();
    }
};

alert('Hi there!');