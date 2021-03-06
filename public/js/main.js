$(document).ready(function() {
  var c = document.getElementById('date-picker');
  c.width = $('#date-art').width();
  c.height = (c.width * 7) / 51 + 2
  c.style.width = c.width.toString() + 'px';
  c.style.height = c.height.toString() + 'px';

  var grid = new SquareGrid(c);
  grid.draw('#b2b2b2');

  var rect = c.getBoundingClientRect();

  var clicking = false;

  var sent = false;

  $(window).resize(function() {
    rect = c.getBoundingClientRect();
  });

  $('#date-picker').click(function(e) {
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;
    console.log(y);
    grid.changeSquare(x, y);
  });

  $('#date-picker').mousedown(function() {
    clicking = true;
  });

  $('#date-picker').mouseup(function() {
    clicking = false;
  });

  $('#date-picker').mousemove(function(e) {
    if (clicking) {
      var x = e.pageX - rect.left;
      var y = e.pageY - rect.top;
      console.log(y);
      grid.changeSquare(x, y);
    }
  });

  $('#brush').click(function() {
    $('#brush').addClass('active');
    $('#eraser').removeClass('active');
    grid.changeBrush('draw');
  });

  $('#eraser').click(function() {
    $('#eraser').addClass('active')
    $('#brush').removeClass('active');
    grid.changeBrush('erase');
  });

  $('#select-all').click(function() {
    grid.draw('#6ee', true);
  });

  $('#clear').click(function() {
    grid.draw('#b2b2b2', false);
  });

  $('#finished').click(function() {
    console.log(grid.encode());
    if (!sent) {
      $.post('/', {pattern: grid.encode()})
        .done(function(data) {
          alert("Done! Go check out your terminal");
          sent = true;
          $.post('/terminate');
        }).fail(function() {
          alert("It seems there has been an error sending data to the server :(");
        });
    }
    else {
      alert("already sent request! Close down server and try again.")
    }

  });
});
