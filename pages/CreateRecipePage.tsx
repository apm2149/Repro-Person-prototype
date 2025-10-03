import React, { useState, useEffect } from 'react';
// FIX: Imported newly defined types to resolve errors.
import { Recipe, StepItem } from '../types';
import { CloseIcon, AlertTriangleIcon } from '../components/icons';
import { useTranslations } from '../App';

interface CreateRecipePageProps {
  onSaveRecipe: (recipe: Omit<Recipe, 'author' | 'rating' | 'qna' | 'reviews' | 'verificationCount' | 'reproductions'> & { id?: string }) => void;
  existingRecipe?: Recipe;
}

type StepInput = Omit<StepItem, 'id' | 'completed'>;
type ConditionInput = NonNullable<Recipe['conditions']>[0];

const CreateRecipePage: React.FC<CreateRecipePageProps> = ({ onSaveRecipe, existingRecipe }) => {
  const t = useTranslations();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<StepInput[]>([{ title: '', details: '', failureTags: [''], pitfall: '' }]);
  const [conditions, setConditions] = useState<ConditionInput[]>([]);
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([{ name: '', url: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingRecipe) {
      setIsEditing(true);
      setTitle(existingRecipe.title);
      setDescription(existingRecipe.description);
      setCategory(existingRecipe.category);
      setIsPremium(existingRecipe.isPremium);
      setIngredients(existingRecipe.ingredients.length > 0 ? existingRecipe.ingredients.map(i => i.text) : ['']);
      setSteps(existingRecipe.steps.length > 0 ? existingRecipe.steps.map(s => ({ ...s, failureTags: (s.failureTags && s.failureTags.length > 0) ? s.failureTags : [''], pitfall: s.pitfall || '' })) : [{ title: '', details: '', failureTags: [''], pitfall: '' }]);
      setConditions(existingRecipe.conditions || []);
      setAttachments(existingRecipe.attachments && existingRecipe.attachments.length > 0 ? existingRecipe.attachments : [{ name: '', url: '' }]);
    }
  }, [existingRecipe]);

  const handleSimpleListChange = (index: number, value: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };
  
  const handleStepChange = <K extends keyof StepInput>(index: number, field: K, value: StepInput[K]) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const addListItem = (setList: React.Dispatch<React.SetStateAction<string[]>>) => setList(prev => [...prev, '']);
  const removeListItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.length > 1) setList(list.filter((_, i) => i !== index));
  };
  
  const addStepItem = () => setSteps([...steps, { title: '', details: '', failureTags: [''], pitfall: '' }]);
  const removeStepItem = (index: number) => {
    if (steps.length > 1) setSteps(steps.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index: number, field: keyof ConditionInput, value: any) => {
    const newConditions = [...conditions];
    if (field === 'options') {
      newConditions[index].options = value.split(',').map((s:string) => s.trim());
    } else {
      (newConditions[index] as any)[field] = value;
    }
    setConditions(newConditions);
  };
  const addCondition = () => setConditions([...conditions, { key: `cond${conditions.length+1}`, name: '', options: [] }]);
  const removeCondition = (index: number) => setConditions(conditions.filter((_, i) => i !== index));

  const handleAttachmentChange = (index: number, field: keyof typeof attachments[0], value: string) => {
    const newAttachments = [...attachments];
    newAttachments[index][field] = value;
    setAttachments(newAttachments);
  };
  const addAttachment = () => setAttachments([...attachments, { name: '', url: '' }]);
  const removeAttachment = (index: number) => {
    if (attachments.length > 1 || attachments[0].name || attachments[0].url) {
      setAttachments(attachments.filter((_, i) => i !== index));
    }
  };


  const handleSubmit = (status: 'pending' | 'draft' | 'published') => {
    if (isSubmitting) return;

    if (status === 'published' && (!title || !description || !category)) {
        // FIX: Used correct translation key.
        alert(t.recipeBasicFieldsRequired);
        return;
    }
    if (steps.some(s => s.title.trim() !== '' && !s.details.trim())) {
        // FIX: Used correct translation key.
        alert(t.stepDetailsRequired);
        return;
    }
    
    setIsSubmitting(true);
    
    const recipeData = {
      id: existingRecipe?.id,
      title,
      description,
      category,
      isPremium,
      status,
      ingredients: ingredients.map((text, i) => ({ id: i + 1, text, completed: false })).filter(item => item.text.trim() !== ''),
      steps: steps.map((step, i) => ({ 
          id: i + 1, 
          ...step,
          failureTags: step.failureTags.map(t => t.trim()).filter(t => t),
          completed: false 
      })).filter(s => s.title.trim() !== ''),
      conditions: conditions.filter(c => c.name.trim() && c.options.length > 0),
      attachments: attachments.filter(a => a.name.trim() && a.url.trim()),
    };
    
    onSaveRecipe(recipeData);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-8">
        {/* FIX: Used correct translation key. */}
        {isEditing ? t.editRecipeTitle : t.createRecipeTitle}
      </h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* Basic Info */}
        <div className="space-y-4">
          {/* FIX: Used correct translation key. */}
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2">{t.basicInfo}</h2>
          <div>
            {/* FIX: Used correct translation key. */}
            <label htmlFor="title" className="block text-lg font-bold text-gray-800">{t.recipeTitleLabel}</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            {/* FIX: Used correct translation key. */}
            <label htmlFor="description" className="block text-lg font-bold text-gray-800">{t.recipeDescLabel}</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" rows={3} required></textarea>
          </div>
          <div>
            {/* FIX: Used correct translation key. */}
            <label htmlFor="category" className="block text-lg font-bold text-gray-800">{t.recipeCatLabel}</label>
            <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>

        {/* Conditions */}
        <div className="space-y-4">
          {/* FIX: Used correct translation key. */}
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2">{t.conditionalBranching}</h2>
          {conditions.map((cond, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <div className="flex justify-between items-center">
                {/* FIX: Used correct translation key. */}
                <h3 className="font-semibold">{t.condition} {index+1}</h3>
                {/* FIX: Used correct translation key. */}
                <button type="button" onClick={() => removeCondition(index)} className="text-red-500 text-sm">{t.remove}</button>
              </div>
              {/* FIX: Used correct translation key. */}
              <input type="text" placeholder={t.conditionNamePlaceholder} value={cond.name} onChange={e => handleConditionChange(index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              {/* FIX: Used correct translation key. */}
              <input type="text" placeholder={t.conditionOptionsPlaceholder} value={cond.options.join(', ')} onChange={e => handleConditionChange(index, 'options', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
          ))}
          {/* FIX: Used correct translation key. */}
          <button type="button" onClick={addCondition} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">{t.addCondition}</button>
        </div>

        {/* Steps */}
        <div className="space-y-6">
            {/* FIX: Used correct translation key. */}
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-2">{t.steps}</h2>
            {steps.map((step, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 relative">
                    <button type="button" onClick={() => removeStepItem(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full" disabled={steps.length <= 1}><CloseIcon className="w-4 h-4"/></button>
                    {/* FIX: Used correct translation key. */}
                    <h4 className="font-bold text-gray-700">{t.step} {index + 1}</h4>
                    {/* FIX: Used correct translation key. */}
                    <input type="text" value={step.title} onChange={(e) => handleStepChange(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.stepTitlePlaceholder} required />
                    {/* FIX: Used correct translation key. */}
                    <textarea value={step.details} onChange={(e) => handleStepChange(index, 'details', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.stepDetailsPlaceholder} rows={4} required/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* FIX: Used correct translation key. */}
                      <input type="text" value={step.duration || ''} onChange={(e) => handleStepChange(index, 'duration', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.durationPlaceholder}/>
                      {/* FIX: Used correct translation key. */}
                      <input type="text" value={step.resources || ''} onChange={(e) => handleStepChange(index, 'resources', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.resourcesPlaceholder}/>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-1"><AlertTriangleIcon className="w-4 h-4"/>{t.pitfallLabel}</label>
                      <textarea value={step.pitfall || ''} onChange={(e) => handleStepChange(index, 'pitfall', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.pitfallPlaceholder} rows={3}/>
                    </div>
                    <div>
                      {/* FIX: Used correct translation key. */}
                      <label className="block text-sm font-semibold text-gray-600 mb-1">{t.failureTagsLabel}</label>
                      {/* FIX: Used correct translation key. */}
                      <input type="text" value={step.failureTags.join(', ')} onChange={(e) => handleStepChange(index, 'failureTags', e.target.value.split(','))} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.failureTagsPlaceholder}/>
                    </div>
                    {/* FIX: Used correct translation key. */}
                    <textarea value={step.alternatives || ''} onChange={(e) => handleStepChange(index, 'alternatives', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={t.alternativesPlaceholder} rows={2}/>
                    {conditions.length > 0 && (
                        <select value={`${step.condition?.key || ''},${step.condition?.value || ''}`} onChange={e => {
                            const [key, value] = e.target.value.split(',');
                            handleStepChange(index, 'condition', key ? { key, value } : undefined)
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                            {/* FIX: Used correct translation key. */}
                            <option value="">{t.alwaysVisible}</option>
                            {conditions.map(c => c.options.map(opt => <option key={`${c.key}-${opt}`} value={`${c.key},${opt}`}>{`${c.name}: ${opt}`}</option>))}
                        </select>
                    )}
                </div>
            ))}
            {/* FIX: Used correct translation key. */}
            <button type="button" onClick={addStepItem} className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">{t.addStep}</button>
        </div>

        {/* Attachments */}
        <div className="space-y-2">
            {/* FIX: Used correct translation key. */}
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-2">{t.attachmentsLabel}</h2>
            {attachments.map((att, index) => (
              <div key={index} className="flex items-center gap-2">
                  {/* FIX: Used correct translation key. */}
                  <input type="text" placeholder={t.attachmentNamePlaceholder} value={att.name} onChange={e => handleAttachmentChange(index, 'name', e.target.value)} className="w-1/2 px-3 py-2 border rounded-md" />
                  <input type="url" placeholder="https://..." value={att.url} onChange={e => handleAttachmentChange(index, 'url', e.target.value)} className="w-1/2 px-3 py-2 border rounded-md" />
                  <button type="button" onClick={() => removeAttachment(index)}><CloseIcon className="w-5 h-5 text-red-500"/></button>
              </div>
            ))}
            {/* FIX: Used correct translation key. */}
            <button type="button" onClick={addAttachment} className="px-4 py-2 bg-gray-200 text-sm rounded-md">{t.addAttachment}</button>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* FIX: Used correct translation key. */}
            <label className="text-lg font-bold text-gray-800">{t.premiumContentLabel}</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>

        <div className="text-center pt-4 flex justify-center gap-4">
          <button type="button" onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
            {/* FIX: Used correct translation key. */}
            {isSubmitting ? t.saving : t.saveDraft}
          </button>
          <button type="button" onClick={() => handleSubmit('published')} disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isSubmitting ? t.publishing : t.publishRecipe}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;
