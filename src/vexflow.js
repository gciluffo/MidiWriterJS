class VexFlow {

	constructor() {
		// code...
	}

	/**
	 * Support for converting VexFlow voice into MidiWriterJS track
	 * @return MidiWritier.Track object
	 */
	trackFromVoice(voice) {
		var track = new Track();
		var wait;
		var pitches = [];

		voice.tickables.forEach(function (tickable) {
			pitches = [];

			if (tickable.noteType === 'n') {
				tickable.keys.forEach(function (key) {
					// build array of pitches
					pitches.push(this.convertPitch(key));
				});

			} else if (tickable.noteType === 'r') {
				// move on to the next tickable and use this rest as a `wait` property for the next event
				wait = this.convertDuration(tickable);
				return;
			}

			track.addEvent(new NoteEvent({ pitch: pitches, duration: this.convertDuration(tickable), wait: wait }));

			// reset wait
			wait = 0;
		});

		return track;
	}


	/**
	 * Converts VexFlow pitch syntax to MidiWriterJS syntax
	 * @param pitch string
	 */
	convertPitch(pitch) {
		return pitch.replace('/', '');
	}


	/**
	 * Converts VexFlow duration syntax to MidiWriterJS syntax
	 * @param note struct from VexFlow
	 */
	convertDuration(note) {
		switch (note.duration) {
			case 'w':
				return '1';
			case 'h':
				return note.getDots() ? 'd2' : '2';
			case 'q':
				return note.getDots() ? 'd4' : '4';
			case '8':
				return note.getDots() ? 'd8' : '8';
		}

		return note.duration;
	};
}

export { VexFlow };
