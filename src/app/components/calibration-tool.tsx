'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getCalibration } from '@/app/actions';
import type { CalibrateMoistureReadingsOutput } from '@/ai/flows/calibrate-moisture-readings';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/icons';
import { PlusCircle, Trash2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  grainType: z.string({ required_error: 'Please select a grain.' }).min(1, 'Please select a grain.'),
  sampleData: z
    .array(
      z.object({
        sensorReading: z.coerce.number({ invalid_type_error: 'Must be a number' }).min(0, 'Must be positive.'),
        actualMoisture: z.coerce.number({ invalid_type_error: 'Must be a number' }).min(0, 'Must be positive.').max(100, 'Cannot exceed 100.'),
      })
    )
    .min(2, 'At least two data points are required for calibration.'),
});

type FormData = z.infer<typeof formSchema>;

function SubmitButton() {
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
      {isSubmitting ? (
        <>
          <LoadingSpinner className="mr-2 h-4 w-4" />
          Calibrating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Calibrate with AI
        </>
      )}
    </Button>
  );
}

export function CalibrationTool() {
  const [result, setResult] = useState<CalibrateMoistureReadingsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grainType: 'Rice',
      sampleData: [
        { sensorReading: 150, actualMoisture: 12.5 },
        { sensorReading: 350, actualMoisture: 22.1 },
      ],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sampleData',
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setResult(null);
    try {
      const calibrationResult = await getCalibration(data);
      setResult(calibrationResult);
      toast({
        title: 'Calibration Successful!',
        description: `New calibration generated for ${data.grainType}.`,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Calibration Failed',
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">AI Calibration Tool</CardTitle>
        <CardDescription>
          Improve accuracy by generating a new calibration curve from your sample data.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="grainType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grain Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grain to calibrate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Maize">Maize</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Sample Data</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 sm:gap-4">
                    <p className="text-sm font-medium text-muted-foreground">{index + 1}.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 flex-grow">
                      <FormField
                        control={form.control}
                        name={`sampleData.${index}.sensorReading`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Sensor Reading" {...field} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`sampleData.${index}.actualMoisture`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Actual Moisture (%)" {...field} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 2}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove sample</span>
                    </Button>
                  </div>
                ))}
              </div>
                {form.formState.errors.sampleData?.root && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.sampleData.root.message}
                  </p>
                )}
            </div>

            <Button type="button" variant="outline" onClick={() => append({ sensorReading: 0, actualMoisture: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Sample
            </Button>
          </CardContent>
          <Separator />
          <CardFooter className="pt-6 flex flex-col sm:flex-row justify-between items-start gap-4">
             <p className="text-xs text-muted-foreground max-w-xs">
                Provide at least two samples. More samples will result in a more accurate calibration.
              </p>
              <SubmitButton />
          </CardFooter>
        </form>
      </Form>
      
      {(result || error) && (
        <div className="px-6 pb-6">
            <Separator className="mb-6"/>
            {result && (
                <Alert className="bg-accent/50 dark:bg-accent/20 border-accent">
                    <Wand2 className="h-4 w-4 text-accent-foreground" />
                    <AlertTitle className="text-accent-foreground">Calibration Result</AlertTitle>
                    <AlertDescription className="text-accent-foreground/90 space-y-2 mt-2">
                        <p><strong>Equation:</strong> {result.calibrationEquation}</p>
                        <p><strong>R-squared:</strong> {result.rSquared.toFixed(4)}</p>
                    </AlertDescription>
                </Alert>
            )}
        </div>
      )}
    </Card>
  );
}
