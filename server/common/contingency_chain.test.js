var contingency = require('./contingency_chain').contingency;

test('Contingency on nested b from a = {a:1, b:2}, b = {b:3}, c = {a:4, b = {c:4, b:5}} equals 5', () =>
{
    a = {a:1, b:2};
    b = {b:3};
    c = {a:4, b : {c:4, b:5}};
    expect(contingency(
        [a, ["b"]],
        [b, ["b"]],
        [c, ["b", "b"]])).toBe(5)
})