export function nodePaint({ id, x, y }, color, ctx) {
  ctx.fillStyle = color;
  [
    () => {
      ctx.fillRect(x - 6, y - 4, 12, 8);
    }, // rectangle
    () => {
      ctx.beginPath();
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x - 5, y + 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.fill();
    }, // triangle
    () => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
      ctx.fill();
    }, // circle
    // () => {
    //   ctx.font = '10px Sans-Serif';
    //   ctx.textAlign = 'center';
    //   ctx.textBaseline = 'middle';
    //   ctx.fillText('Text', x, y);
    // }, // text
  ][id % 3]();
}

export default nodePaint;
