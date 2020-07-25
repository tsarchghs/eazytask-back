
const { Tasker, Language, Skill, Tasker_Language, Tasker_Skill } = require("../../models")
const cloneDeep = require("../utils/cloneDeep")

const { ErrorHandler } = require("../../utils/error");

const { findLanguageByName, createLanguage } = require("../languages-dal");
const { findSkillByName, createSkill } = require("../skills-dal");
const { findCityByName, createCity } = require("../cities-dal");

module.exports = {
    findTaskerByPk: async id => await Tasker.findByPk(id, {include: [Language, Skill] }),
    findOne: async userId => {
        let tasker = await Tasker.findOne({where:{"UserId": userId}});
        return tasker;
    },
    createTasker: async ({userId,skills,languages,cities}) => {
        console.log({ userId, skills, languages, cities })
        let data = { UserId: userId }

        let city_instances = []
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
            if (!skill_promise) {
                skill_promise = await createSkill({ name: skill, createdByUser: true })
            }
            skill_instances.push(skill_promise);
        }

        for (city of cities) {
            let city_promise = await findCityByName(city)
            if (!city_promise) {
                city_promise = await createCity({ name: city, createdByUser: true })
            }
            city_instances.push(city_promise);
        }

        await Promise.all([
            ...language_instances,
            ...skill_instances,
            ...city_instances
        ]);

        let tasker = await Tasker.create(data);
        tasker.setLanguages(language_instances.map(x => x.id));
        tasker.setSkills(skill_instances.map(x => x.id));
        tasker.setCities(city_instances.map(x => x.id));
        tasker = cloneDeep(tasker)
        tasker.Languages = cloneDeep(language_instances)
        tasker.Skills = cloneDeep(skill_instances)
        tasker.Cities = cloneDeep(city_instances)
        return tasker;
    }
}