
const { Tasker, Tasker_Language, Tasker_Skill } = require("../../models")
const cloneDeep = require('../../utils/cloneDeep');

const { ErrorHandler } = require("../../utils/error");

const { findLanguageByName, createLanguage } = require("../languages-dal");
const { findSkillByName, createSkill } = require("../skills-dal");

module.exports = {
    findTaskerByPk: async id => (await Tasker.findByPk(id)),
    findOne: async userId => {
        let tasker = await Tasker.findOne({where:{"UserId": userId}});
        return tasker;
    },
    createTasker: async ({userId,area_of_activity,skills,languages}) => {
        let data = { UserId: userId, area_of_activity }

        let language_instances = [] 
        let skill_instances = [] 

        for (lang of languages) {
            console.log({lang})
            let language_promise = await findLanguageByName(lang)
            if (!language_promise) {
                language_promise = await createLanguage({ name: lang, createdByUser: true })
            }
            language_instances.push(language_promise);
        }

        for (skill of skills) {
            let skill_promise = await findSkillByName(skill)
            if (!skill_promise){
                skill_promise = await createSkill({ name: skill, createdByUser: true })
            }
            skill_instances.push(skill_promise);
        }

        await Promise.all(language_instances.concat(skill_instances));
        let tasker = await Tasker.create(data);
        console.log({language_instances,skill_instances})
        tasker.setLanguages(language_instances.map(x => x.id));
        tasker.setSkills(skill_instances.map(x => x.id));tasker
        tasker = cloneDeep(tasker)
        tasker.Languages = cloneDeep(language_instances)
        tasker.Skills = cloneDeep(skill_instances)
        return tasker;
    }
}