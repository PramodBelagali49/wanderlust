    const handleUpload = async () => {
        if (!selectedFile) {
            showErrorMessage("Please select an image first");
            return;
        }
        
        setLoading(true);
        
        try {
            // Get upload credentials from backend
            const credentials = await getCloudinaryCredentials('profile');
            if (!credentials || !credentials.cloud_name) {
                throw new Error('Failed to get upload credentials. Please try again.');
            }
            
            // Upload to Cloudinary
            const imageUrl = await uploadToCloudinary(selectedFile, credentials);
            if (!imageUrl) {
                throw new Error('Failed to upload image. Please try again.');
            }
            
            // Update user profile with the uploaded image URL using Zustand store
            const result = await updatePhoto(imageUrl);
            
            if (result.success) {
                showSuccessMessage("Profile photo updated successfully!");
                onClose();
            } else {
                throw new Error(result.error || "Failed to update profile photo. Please try again.");
            }
        } catch (error) {
            let errorMessage = "Failed to update profile photo. Please try again.";
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };