
Cryptii
=======

Input
  |
  |
  |
  V
Blocks of decimal
  |          |
  |          |
  |          |
  V          V
Output     Output


When input changes, it keeps track of which blocks changed (Added / Removed Blocks):


var current = 'Hello World';
function differenceRange(from, to)
{
	var length = Math.min(from.length, to.length);
	var start = 0;
	var end = 0;

	while (
		start < length
		&& from[start] == to[start]
	) {
		start ++;
	}

	while (
		end < length - start
		&& from[from.length - end - 1] == to[to.length - end - 1]
	) {
		end ++;
	}

	if (start == length - 1)
	{
		// no difference
		return null;
	}

	// range of difference
	return {
		start: start,
		end: to.length - end - 1,
		length: to.length - start - end
	};

	var difference = current.substr(0, start) + '[' + input.substr(start, input.length - start - end) + ']' + current.substr(current.length - end);

	console.log('Start: ' + start + ', Length: ' + (input.length - start - end));
	console.log('Difference: ' + difference);
}

function difference(from, to)
{
	var range = differenceRange(from, to);

	if (range !== null)
	{
		console.log(from.substr(0, start) + '[' + to.substr(start, input.length - start - end) + ']' + from.substr(current.length - end);
	}
}


Hello World

1 deletion
'o' removed
Hell World
>>>><<<<<<

1 addition
'o added'
Hello World
>>>>!<<<<<<
