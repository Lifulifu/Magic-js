$(document).ready(function(){

	let mc = new MagicCircle('container', 200);

	let mc2 = new MagicCircle(); // sub-circle
	mc2.add(Shapes.circle())
		.add(Shapes.text('Q', {fontSize: 80}));

	mc.add(Shapes.circle({padding:5}))
		.add(Shapes.circle())
		.add(Shapes.chain([mc2, mc2, mc2, mc2, mc2, mc2]))
		.add(Shapes.circle())
		.add(Shapes.star(6, 2))


	mc.draw();



	new Vivus('drawing', {
		type: 'delayed',
		delay: 150,
		duration: 200,
		animTimingFunction: Vivus.EASE_OUT
	});

});



