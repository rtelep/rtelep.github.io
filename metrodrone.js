var NOTES = [
        ['E', 'E2', 'B2']
    ,   ['D', 'D2', 'A2']
    ,   ['G', 'G2', 'D3']
    ,   ['F', 'F2', 'C3']
    ,   ['Bb','Bb2','F3']
    ,   ['Eb','Eb2','Bb2']
    ,	['C', 'C2',  'G3']
];

var BPM = 112;

function Drone(){
    
    var D = this;
    
    D.init = function(){
        D.drone = new Tone.FMSynth({
            "oscillator" : {
                "type" : "pwm",
                "modulationFrequency" : 0.01
            },
            "envelope" : {
                "attack" : 0.02,
                "decay" : 0.1,
                "sustain" : 0.1,
                "release" : 0.1,
            }
        }).toMaster();
        
        D.chant = new Tone.FMSynth({
            "oscillator" : {
                "type" : "pwm",
                "modulationFrequency" : 0.01
            },
            "envelope" : {
                "attack" : 0.02,
                "decay" : 0.1,
                "sustain" : 0.1,
                "release" : 0.1,
            }
        }).toMaster();
        
    };
    
    D.play = function(drone_pitch, chant_pitch){
        D.stop();
        D.init();
        D.drone.triggerAttack(drone_pitch);
        D.chant.triggerAttack(chant_pitch);
    };

    D.stop = function(){
        try {
            D.drone.dispose();
            D.chant.dispose();
        } catch (e){
            
        }
    };


    return true;

}

function Metronome(){
    var M = this;
    M.player = new Tone.Player('woodblock.wav').toMaster();
    M.loop = new Tone.Loop(function(time){
        M.player.start(time);
    }, '4n');
    M.loop.start();
    
    M.start = function(){
        Tone.Transport.start();
    };

    M.stop = function(){
        Tone.Transport.stop();  
    };
    
    return true;
}


$(document).ready(function() {
    drone = new Drone();
    
    $.each(NOTES, function(n, note){
        var button = $('<h1>')
            .attr('drone', note[1])
            .attr('chant', note[2])
            .html(note[0])
            .appendTo('#notes')
            .on('click touch', function(e,h){
                var drone_pitch = $(e.target).attr('drone');
                var chant_pitch = $(e.target).attr('chant');
                if (drone_pitch == 'stop') {
                    drone.stop();
                } else  {
                    drone.play(drone_pitch, chant_pitch);
                }
            });
    });

    $('#drone_stop').on('click touch', function(e){
        drone.stop();
    });    
    
    
    
    
    metronome = new Metronome();
    
    var slider = $('#metronome');
    var output = $('#metronome_value');
    var start = $('#metronome_start');
    var stop = $('#metronome_stop');
    slider.val(BPM);
    var tempo = slider.val();
    Tone.Transport.bpm.value = tempo;
    output.html(tempo);
    slider.on('input', function(e) {
        var tempo = $(this).val();
        output.html(tempo);
        Tone.Transport.bpm.value = tempo;
    });
    start.on('click touch', function(){
        metronome.start();
    });
    stop.on('click function', function(){
        metronome.stop();
    
    });
    
    
});
