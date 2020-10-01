const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders');
  },

  insertFolders(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('public.folders')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id){
    return knex
      .select('*')
      .from('folders')
      .where('id', id)
      .first();
  },

  deleteFolder(knex, id){
    return knex('folders')
      .where({ id })
      .delete();
  },

  updateFolder(knex, id, newName){
    return knex('folders')
      .where({ id })
      .update(newName);
  },
};

module.exports = FoldersService;