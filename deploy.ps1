# deploy.ps1

# 1. Build the project
echo "Building project..."
npm run build

# 2. Navigate to the build output directory
cd dist

# 3. Initialize a new git repo for deployment
git init
git checkout -b main
git add -A
git commit -m 'deploy'

# 4. Push to the gh-pages branch of your repository
# Note: We are pushing to the 'gh-pages' branch.
git push -f https://github.com/charansaikondilla/piorate-ventures.git main:gh-pages

cd ..
echo "Deployment complete! check https://charansaikondilla.github.io/piorate-ventures/"
