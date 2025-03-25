
async function getSchemaVersion() {
    const record = await GlobalValueModel.findOne({
        attributes: ['schema_version'],
    });
  
    return record?.schema_version ?? 0;
};

async function dbMigrateSync() {
    const version = getSchemaVersion();
}