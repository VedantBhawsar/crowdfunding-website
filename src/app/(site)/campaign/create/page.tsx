'use client';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import { X, Plus, Info, Calendar, Loader2, FileImage } from 'lucide-react'; // Added Loader2

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Define the milestone schema with completion percentage
// Mark the object itself as required if it exists in the array
const milestoneSchema = z.object({
  title: z.string().min(3, { message: 'Milestone title is required (min 3)' }),
  description: z.string().min(10, { message: 'Milestone description is required (min 10)' }),
  targetDate: z.string().optional(),
  completionPercentage: z.number().min(0).max(100).default(0),
});

// Define the reward schema
const rewardSchema = z.object({
  title: z.string().min(3, { message: 'Reward title is required' }),
  description: z.string().min(10, { message: 'Description is required' }),
  amount: z.number().min(0.01, { message: 'Amount must be positive' }),
  deliveryDate: z.string().optional(),
});

// Define milestone and reward types from schema
// Use NonNullable to ensure the object exists when accessing fields
type MilestoneType = z.infer<typeof milestoneSchema>;
type RewardType = z.infer<typeof rewardSchema>;

// Define the main form schema with zod
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long' }).max(100),
  slug: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    }),
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(100),
  goal: z.number({ required_error: 'Please enter a valid funding goal' }).min(0.1),
  durationDays: z
    .number({ required_error: 'Please enter a valid campaign duration' })
    .min(1)
    .max(90),
  category: z.string({ required_error: 'Please select a category' }),
  tags: z.string().optional(),
  rewards: z.array(rewardSchema).optional(),
  // Ensure that if a milestone object exists, its fields are validated
  milestones: z
    .array(milestoneSchema.required())
    .optional()
    .refine(
      milestones => {
        if (!milestones || milestones.length < 2) return true;
        for (let i = 1; i < milestones.length; i++) {
          // Check if both current and previous milestones exist before comparing
          if (
            milestones[i] &&
            milestones[i - 1] &&
            milestones[i]!.completionPercentage < milestones[i - 1]!.completionPercentage
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message: 'Milestone completion percentage cannot decrease.',
        path: ['milestones'], // Apply error to the whole array for visibility
      }
    ),
  riskAssessment: z.string().optional(),
  socialLinks: z
    .object({
      website: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
      github: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Categories from Prisma schema CampaignCategory enum
const CATEGORIES = [
  'TECHNOLOGY',
  'ARTS',
  'GAMES',
  'FILM',
  'MUSIC',
  'DESIGN',
  'FOOD',
  'PUBLISHING',
  'FASHION',
  'COMMUNITY',
  'OTHER'
];

export default function CreateCampaignPage() {
  const { data: session } = useSession();
  console.log(session?.user);
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Initialize state with correct types
  const [rewardsData, setRewardsData] = useState<RewardType[]>([]);
  const [milestonesData, setMilestonesData] = useState<MilestoneType[]>([
    { title: '', description: '', targetDate: '', completionPercentage: 0 },
  ]);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      goal: 1,
      durationDays: 30,
      category: '',
      tags: '',
      rewards: [],
      milestones: [{ title: '', description: '', targetDate: '', completionPercentage: 0 }],
      riskAssessment: '',
      socialLinks: {
        website: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        github: '',
      },
    },
    mode: 'onChange', // Validate on change
  });

  const {
    formState: { isSubmitting },
  } = form; // Get isSubmitting state

  // Effect for redirect and cleanup
  useEffect(() => {
    if (session && session.user && session.user.role !== 'CREATOR') {
      toast.error('Only creators can create campaigns');
      router.push('/campaigns');
    }
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [session, router, imageUrls]);

  // --- Image Handling ---
  const handleImageUpload = (result: any) => {
    if (result.info.secure_url) {
      setImageUrls(prev => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };

  // --- Tag Handling ---
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setTagInput('');
      form.setValue('tags', newTags.join(','), { shouldValidate: true }); // Update RHF state
    } else if (tags.length >= 10) {
      toast.warning('Maximum of 10 tags allowed.');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags.join(','), { shouldValidate: true }); // Update RHF state
  };

  // --- Reward Functions (Update RHF state) ---
  const addReward = () => {
    const newReward = {
      title: '',
      description: '',
      amount: 0.1,
      deliveryDate: '',
    };
    setRewardsData([...rewardsData, newReward]);

    // Also update form state
    const currentRewards = form.getValues('rewards') || [];
    form.setValue('rewards', [...currentRewards, newReward], {
      shouldValidate: true,
    });
  };

  const removeReward = (index: number) => {
    const newRewards = rewardsData.filter((_, i) => i !== index);
    setRewardsData(newRewards);

    // Also update form state
    form.setValue('rewards', newRewards, { shouldValidate: true });
  };

  const updateReward = (index: number, field: keyof RewardType, value: any) => {
    const updatedRewards = [...rewardsData];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [field]: value,
    };
    setRewardsData(updatedRewards);

    // Also update form state
    form.setValue('rewards', updatedRewards, { shouldValidate: true });
  };

  // --- Milestone Functions (Update RHF state) ---
  const addMilestone = () => {
    const lastMilestone = milestonesData[milestonesData.length - 1];
    if (lastMilestone && lastMilestone.completionPercentage === 100) {
      toast.info('Project already marked as 100% complete.');
      return;
    }
    const startPercentage = lastMilestone ? lastMilestone.completionPercentage : 0;
    const newMilestone: MilestoneType = {
      title: '',
      description: '',
      targetDate: '',
      completionPercentage: startPercentage,
    };
    const newMilestones = [...milestonesData, newMilestone];
    setMilestonesData(newMilestones);
    // Use type assertion to tell TypeScript this is compatible with the expected type
    form.setValue('milestones', newMilestones as any, { shouldValidate: true });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestonesData.filter((_, i) => i !== index);
    setMilestonesData(newMilestones);
    // Use type assertion to tell TypeScript this is compatible with the expected type
    form.setValue('milestones', newMilestones as any, { shouldValidate: true });
  };

  const updateMilestone = (index: number, field: keyof MilestoneType, value: any) => {
    let updatedValue = value;
    const newMilestones = [...milestonesData];

    if (field === 'completionPercentage') {
      // Slider might pass array, ensure we get the number
      const percentage = Array.isArray(value)
        ? value[0]
        : typeof value === 'number'
          ? value
          : parseInt(value || '0', 10);
      let clampedPercentage = Math.max(0, Math.min(100, percentage));
      const prevPercentage = index > 0 ? (newMilestones[index - 1]?.completionPercentage ?? 0) : 0;
      clampedPercentage = Math.max(prevPercentage, clampedPercentage);
      const nextPercentage =
        index < newMilestones.length - 1
          ? (newMilestones[index + 1]?.completionPercentage ?? 100)
          : 100;
      clampedPercentage = Math.min(nextPercentage, clampedPercentage);
      updatedValue = clampedPercentage;
    }

    // Update the specific field in the milestone object
    newMilestones[index] = { ...newMilestones[index], [field]: updatedValue };

    setMilestonesData(newMilestones);
    // Update RHF state for the specific field and trigger validation
    form.setValue(`milestones.${index}.${field}`, updatedValue, {
      shouldValidate: true,
    });
    // Also trigger validation for the whole array if percentage changed, due to refine rule
    if (field === 'completionPercentage') {
      form.trigger('milestones');
    }
  };

  // --- Slug Generation ---
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    form.setValue('slug', slug, { shouldValidate: true });
  };

  // --- Form Submission (Using RHF's handler) ---
  const onSubmit = async (data: FormValues) => {
    if (!session?.user?.id) {
      toast.error('Please connect your wallet to create a campaign.');
      return;
    }

    try {
      // Clean up and create a campaign data object with all required data
      const campaignData = {
        ...data,
        images: imageUrls,
        tags: tags.join(','),
        milestones: milestonesData.filter(m => m.title && m.description),
        rewards: rewardsData.filter(r => r.title && r.description),
      };
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `Failed to create campaign (${response.status})`);
      }

      const result = await response.json();
      toast.success('Your campaign has been created successfully.');
      router.push(`/campaign/${result.slug}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  // --- Render Logic ---
  if (!session) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isProjectComplete =
    milestonesData.length > 0 &&
    milestonesData[milestonesData.length - 1]?.completionPercentage === 100;

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Campaign</h1>
        <p className="text-muted-foreground">Fill in the details below to launch your project.</p>
      </div>

      {/* Use form.handleSubmit to trigger validation and onSubmit */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="media">Media & Links</TabsTrigger>
            </TabsList>

            {/* --- Basics Tab --- */}
            <TabsContent value="basics" className="space-y-8">
              <h2 className="text-xl font-semibold border-b pb-2">Campaign Basics</h2>
              {/* Fields remain the same, relying on <FormMessage /> for errors */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    <FormLabel>Campaign Title *</FormLabel>{' '}
                    <FormControl>
                      <Input
                        placeholder="e.g., The Next Gen Decentralized Social Platform"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          if (!form.getValues('slug')) generateSlug(e.target.value);
                        }}
                      />
                    </FormControl>{' '}
                    <FormDescription>Make it clear and exciting.</FormDescription>{' '}
                    <FormMessage />{' '}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    <FormLabel>Campaign URL *</FormLabel>{' '}
                    <FormControl>
                      <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-2 border-r">
                          yourplatform.com/campaigns/
                        </span>
                        <Input
                          placeholder="your-unique-slug"
                          className="border-0 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                          {...field}
                        />
                      </div>
                    </FormControl>{' '}
                    <FormDescription>Lowercase letters, numbers, and hyphens only.</FormDescription>{' '}
                    <FormMessage />{' '}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    <FormLabel>Short Description *</FormLabel>{' '}
                    <FormControl>
                      <Textarea
                        placeholder="Briefly summarize your campaign (max 200 chars)."
                        className="resize-none"
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>{' '}
                    <FormDescription>
                      Appears on cards/previews. ({field.value?.length || 0}
                      /200)
                    </FormDescription>{' '}
                    <FormMessage />{' '}
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      {' '}
                      <FormLabel>Funding Goal (ETH) *</FormLabel>{' '}
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1.0"
                          min={0.1}
                          step={0.01}
                          value={value ?? ''}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            onChange(isNaN(val) ? undefined : val);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>{' '}
                      <FormDescription>Minimum 0.1 ETH required.</FormDescription>{' '}
                      <FormMessage />{' '}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationDays"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      {' '}
                      <FormLabel>Duration (Days) *</FormLabel>{' '}
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={90}
                          step={1}
                          placeholder="30"
                          value={value ?? ''}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            onChange(isNaN(val) ? undefined : val);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>{' '}
                      <FormDescription>1-90 days.</FormDescription> <FormMessage />{' '}
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    <FormLabel>Category *</FormLabel>{' '}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      {' '}
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>{' '}
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {/* Convert enum value to title case for display */}
                            {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>{' '}
                    </Select>{' '}
                    <FormDescription>Helps backers find you.</FormDescription> <FormMessage />{' '}
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* --- Details Tab --- */}
            <TabsContent value="details" className="space-y-8">
              <h2 className="text-xl font-semibold border-b pb-2">Project Details</h2>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    <FormLabel>Full Project Description *</FormLabel>{' '}
                    <FormControl>
                      <Textarea
                        placeholder="Go into detail: Problem, Solution, Team, Roadmap, Why support..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>{' '}
                    <FormDescription>Min 100 characters. Be persuasive.</FormDescription>{' '}
                    <FormMessage />{' '}
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="Add relevant tags (e.g., web3, defi)"
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>Press Enter or comma (max 10 tags).</FormDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="group relative pr-6">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="absolute top-1/2 right-1 transform -translate-y-1/2 ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => <input type="hidden" {...field} />}
                />{' '}
                {/* Keep hidden field if needed */}
              </FormItem>
              <FormField
                control={form.control}
                name="riskAssessment"
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    <FormLabel>
                      Risks & Challenges (Optional)
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1.5 inline-block text-muted-foreground relative top-[-1px]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Transparency builds trust. Outline hurdles & mitigation plans.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>{' '}
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Technical hurdles, market adoption, regulatory uncertainty..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>{' '}
                    <FormDescription>Be honest about difficulties.</FormDescription>{' '}
                    <FormMessage />{' '}
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* --- Rewards Tab --- */}
            <TabsContent value="rewards" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold border-b pb-2">Campaign Rewards</h2>
                <Button
                  type="button"
                  onClick={addReward}
                  className="flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" /> Add Reward
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create reward tiers for your backers. What will they receive in exchange for
                  supporting your campaign?
                </p>

                {rewardsData.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                      <Info className="h-10 w-10 text-muted-foreground mb-2" />
                      <CardTitle className="text-lg mb-2">No Rewards Added</CardTitle>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Add reward tiers to incentivize backers. Campaigns with clear rewards tend
                        to perform better!
                      </p>
                      <Button
                        type="button"
                        onClick={addReward}
                        className="mt-4"
                        variant="secondary"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add First Reward
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {rewardsData.map((reward, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">Reward #{index + 1}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeReward(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`reward-title-${index}`}>Title</Label>
                          <Input
                            id={`reward-title-${index}`}
                            value={reward.title}
                            onChange={e => updateReward(index, 'title', e.target.value)}
                            placeholder="e.g., Early Bird Special"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`reward-amount-${index}`}>Amount (ETH)</Label>
                          <Input
                            id={`reward-amount-${index}`}
                            type="number"
                            value={reward.amount}
                            onChange={e =>
                              updateReward(index, 'amount', parseFloat(e.target.value))
                            }
                            min={0.01}
                            step={0.01}
                            placeholder="0.1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`reward-description-${index}`}>Description</Label>
                        <Textarea
                          id={`reward-description-${index}`}
                          value={reward.description}
                          onChange={e => updateReward(index, 'description', e.target.value)}
                          placeholder="What will backers receive for this reward tier?"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`reward-delivery-${index}`}>Estimated Delivery Date</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`reward-delivery-${index}`}
                            type="date"
                            value={reward.deliveryDate}
                            onChange={e => updateReward(index, 'deliveryDate', e.target.value)}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" type="button">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>When do you expect to deliver this reward?</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* --- Milestones Tab --- */}
            <TabsContent value="milestones" className="space-y-8">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-semibold">Project Milestones (Optional)</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMilestone}
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={isProjectComplete}
                >
                  <Plus className="h-4 w-4" /> Add Milestone
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Break down your project into phases. Update completion as you progress.
              </p>
              {/* Display general array error if Zod catches something at array level */}
              <FormMessage>
                {form.formState.errors.milestones?.message ||
                  form.formState.errors.milestones?.root?.message}
              </FormMessage>
              {isProjectComplete && (
                <div className="p-3 text-center border border-green-500 rounded-md bg-green-50 text-green-700">
                  Project marked as 100% complete!
                </div>
              )}
              {milestonesData.length === 0 ? (
                <div className="p-6 text-center border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">No milestones defined.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestonesData.map((milestone, index) => {
                    // Ensure milestone is not null/undefined before accessing properties
                    if (!milestone) return null; // Should not happen with current logic, but good practice

                    const prevPercentage =
                      index > 0 ? (milestonesData[index - 1]?.completionPercentage ?? 0) : 0;
                    // const nextPercentage = index < milestonesData.length - 1 ? (milestonesData[index + 1]?.completionPercentage ?? 100) : 100;
                    const canEditPercentage =
                      !isProjectComplete || milestone.completionPercentage < 100;

                    return (
                      <Card key={index} className="relative bg-card/50 border shadow-sm">
                        {/* Field-specific messages */}
                        <FormMessage className="px-6 pt-2 text-xs text-red-600">
                          {form.formState.errors.milestones?.[index]?.title?.message}
                        </FormMessage>
                        <FormMessage className="px-6 pt-1 text-xs text-red-600">
                          {form.formState.errors.milestones?.[index]?.description?.message}
                        </FormMessage>
                        <FormMessage className="px-6 pt-1 text-xs text-red-600">
                          {form.formState.errors.milestones?.[index]?.completionPercentage?.message}
                        </FormMessage>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeMilestone(index)}
                          aria-label="Remove milestone"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardHeader className="pb-2 pt-4">
                          <CardTitle className="text-base">
                            <Label htmlFor={`milestone-title-${index}`}>
                              Milestone #{index + 1} Title *
                            </Label>
                            <Input
                              id={`milestone-title-${index}`}
                              value={milestone.title}
                              onChange={e => updateMilestone(index, 'title', e.target.value)}
                              placeholder="e.g., Phase 1: Research"
                              className="mt-1 font-medium"
                            />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label htmlFor={`milestone-desc-${index}`}>Description *</Label>
                            <Textarea
                              id={`milestone-desc-${index}`}
                              value={milestone.description}
                              onChange={e => updateMilestone(index, 'description', e.target.value)}
                              placeholder="Objective & deliverables."
                              className="mt-1 min-h-[60px]"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`milestone-date-${index}`}>
                              Target Date (Optional)
                            </Label>
                            <div className="relative">
                              <Input
                                id={`milestone-date-${index}`}
                                type="date"
                                value={milestone.targetDate}
                                onChange={e => updateMilestone(index, 'targetDate', e.target.value)}
                                className="mt-1 pl-8"
                              />
                              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`milestone-completion-${index}`}>
                              Completion ({milestone.completionPercentage}%)
                            </Label>
                            <div className="flex items-center gap-3 mt-1">
                              <Slider
                                id={`milestone-completion-${index}`}
                                min={prevPercentage}
                                max={100}
                                step={1}
                                value={[milestone.completionPercentage]}
                                onValueChange={value =>
                                  updateMilestone(index, 'completionPercentage', value)
                                }
                                className="flex-1"
                                disabled={!canEditPercentage}
                              />
                              <span className="text-sm font-medium min-w-[40px] text-right">
                                {milestone.completionPercentage}%
                              </span>
                            </div>
                            <Progress value={milestone.completionPercentage} className="h-2 mt-2" />
                            {/* Refine error message will show at array level */}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* --- Media & Links Tab --- */}
            <TabsContent value="media" className="space-y-8">
              <h2 className="text-xl font-semibold border-b pb-2">Media & Links</h2>
              <div className="space-y-4">
                <FormLabel>Campaign Images (Optional)</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden border group bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Visual ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {imageUrls.length < 5 && (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer aspect-video hover:border-primary hover:bg-muted/50 transition-colors text-muted-foreground">
                      <CldUploadButton
                        options={{ maxFiles: 1 }}
                        // onUpload={handleImageUpload}
                        onSuccess={handleImageUpload}
                        uploadPreset="iug38uvw"
                      >
                        <FileImage size={20} className="text-indigo-500 dark:text-indigo-400" />
                      </CldUploadButton>
                    </label>
                  )}
                </div>
                <FormDescription>
                  Add up to 5 visuals (16:9 recommended). First is thumbnail.
                </FormDescription>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">External Links (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Link to website, socials, code, etc.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="socialLinks.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourproject.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter / X</FormLabel>
                        <FormControl>
                          <Input placeholder="https://x.com/yourhandle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/yourorg/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/company/yourcompany"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/yourprofile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <Separator />
          <div className="flex justify-end gap-4 pt-4">
            {/* Display general form error */}
            {form.formState.errors.root && (
              <p className="text-sm text-destructive mr-auto">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
