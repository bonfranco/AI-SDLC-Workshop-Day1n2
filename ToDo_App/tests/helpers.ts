export interface BrowserPageLike {
  getByPlaceholder: (value: string) => { fill: (text: string) => Promise<void> };
  getByRole: (role: string, options: { name: string }) => { click: () => Promise<void> };
}

export async function createTodo(page: BrowserPageLike, title: string) {
  await page.getByPlaceholder('What needs to be done?').fill(title);
  await page.getByRole('button', { name: 'Add' }).click();
}
