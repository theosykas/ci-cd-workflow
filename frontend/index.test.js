// Une fonction simple que tu pourrais avoir dans ton code frontend
function additionner(a, b) {
    return a + b;
}

// Test 1 : On vérifie que la CI et Jest fonctionnent
test('La CI fonctionne correctement', () => {
    expect(true).toBe(true);
});

// Test 2 : On teste notre vraie fonction
test('La fonction additionner ajoute bien 2 nombres', () => {
    expect(additionner(2, 3)).toBe(5);
    expect(additionner(-1, 1)).toBe(0);
});