const connection = require('../index');
const { getUser } = require('./userQueries');

async function getJob(job_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM jobs WHERE id = ?', [job_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('Job not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch job:', err);
        throw err;
    }
}

async function setJob(user_id, job_id) {
    try {
        const user = await getUser(user_id);
        if (user) {
            connection.connection.execute('UPDATE users SET job_id = ? WHERE user_id = ?', [job_id, user_id]);
            console.log('Job updated for user', user_id);
        }
    } catch (err) {
        console.error('Error while trying to update job:', err);
        throw err;
    }
}

async function getAllJobs() {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM jobs');
        return rows;
    } catch (err) {
        console.error('Error while trying to fetch jobs:', err);
        throw err;
    }
}

module.exports = {
    getJob,
    setJob,
    getAllJobs,
};