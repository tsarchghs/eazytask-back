
const { Tasker, Language, Skill, City, Tasker_Language, Tasker_Skill, Tasker_City } = require("../../models")
const cloneDeep = require("../utils/cloneDeep")

const { ErrorHandler } = require("../../utils/error");

const { findLanguageByName, createLanguage } = require("../languages-dal");
const { findSkillByName, createSkill } = require("../skills-dal");
const { findCityByName, createCity } = require("../cities-dal");

module.exports = {
    findTaskerByPk: async id => await Tasker.findByPk(id, {include: [Language, Skill] }),
    findTaskerByUserPk: async id => await Tasker.findOne({
        where: { UserId: id }
    }),
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
    },
    updateTaskerSkills: async ({taskerId,skills}) => {
        console.log({ taskerId, skills })
        
        skills = skills.filter((v, i, a) => a.indexOf(v) === i);

        let where = { id: taskerId }
        let tasker = await Tasker.findOne({ where, include: [ 
            { model: Skill, required: false }
        ] });
        if (!tasker) throw new Error("Tasker not found ?")
        await Tasker_Skill.destroy({ where: { TaskerId: taskerId }})
        for (skill of skills) {
            let skill_obj = await findSkillByName(skill)
            if (!skill_obj) {
                skill_obj = await createSkill({ name: skill, createdByUser: true })
            }
            await Tasker_Skill.create({
                TaskerId: taskerId,
                SkillId: skill_obj.id
            })
        }
        return tasker;
    },
    updateTaskerLanguages: async ({taskerId,languages}) => {
        console.log({ taskerId, languages })
        
        languages = languages.filter((v, i, a) => a.indexOf(v) === i);

        let where = { id: taskerId }
        let tasker = await Tasker.findOne({ where, include: [ 
            { model: Language, required: false }
        ] });
        if (!tasker) throw new Error("Tasker not found ?")
        await Tasker_Language.destroy({ where: { TaskerId: taskerId }})
        for (language of languages) {
            let language_obj = await findLanguageByName(language)
            if (!language_obj) {
                language_obj = await createLanguage({ name: language, createdByUser: true })
            }
            await Tasker_Language.create({
                TaskerId: taskerId,
                LanguageId: language_obj.id
            })
        }
        return tasker;
    },
    updateTaskerCities: async ({taskerId,cities}) => {
        console.log({ taskerId, cities })
        
        cities = cities.filter((v, i, a) => a.indexOf(v) === i);

        let where = { id: taskerId }
        let tasker = await Tasker.findOne({ where, include: [ 
            { model: City, required: false }
        ] });
        if (!tasker) throw new Error("Tasker not found ?")
        await Tasker_City.destroy({ where: { TaskerId: taskerId }})
        for (city of cities) {
            let city_obj = await findCityByName(city)
            if (!city_obj) {
                city_obj = await createCity({ name: city, createdByUser: true })
            }
            await Tasker_City.create({
                TaskerId: taskerId,
                CityId: city_obj.id
            })
        }
        return tasker;
    },
}